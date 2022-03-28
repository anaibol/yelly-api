import { Injectable } from '@nestjs/common'
import { HttpService } from 'nestjs-http-promise'
import { PrismaService } from '../core/prisma.service'
import { GroupChannel } from './types'

const buildChannelUrl = (userIds: string[]): string => {
  return [...userIds].sort().join('_')
}

type SendbirdUser = {
  user_id: string
  nickname: string
  profile_url: string | null
  issue_access_token: true
  metadata: {
    firstName: string | null
    lastName: string | null
    pictureId: string | null
  }
}

type IncomingUser = {
  id: string
  firstName: string | null
  lastName: string | null
  pictureId: string | null
}

const cleanUndefinedFromObj = (obj: any) =>
  // eslint-disable-next-line functional/immutable-data
  Object.entries(obj).reduce((a: any, [k, v]) => (v === undefined || v === null ? a : ((a[k] = v), a)), {})

@Injectable()
export class SendbirdService {
  constructor(private prismaService: PrismaService, private httpService: HttpService) {}

  async createUser(user: IncomingUser): Promise<string> {
    const profileUrl = user.pictureId && `http://yelly.imgix.net/${user.pictureId}?format=auto`

    const sendbirdUser: SendbirdUser = {
      user_id: user.id,
      nickname: user.firstName + ' ' + user.lastName,
      profile_url: profileUrl,
      issue_access_token: true,
      metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        pictureId: user.pictureId,
      },
    }

    const { data } = await this.httpService.post('users', sendbirdUser)

    return data.access_token
  }

  async updateUser(user: Partial<IncomingUser>): Promise<boolean> {
    const profileUrl = user.pictureId && `http://yelly.imgix.net/${user.pictureId}?format=auto`

    const updatedUserData: Partial<SendbirdUser> = {
      nickname: `${user.firstName} ${user.lastName}`,
      ...cleanUndefinedFromObj({
        profile_url: profileUrl,
      }),
    }

    const metadata = cleanUndefinedFromObj({
      firstName: user.firstName,
      lastName: user.lastName,
      pictureId: user.pictureId,
    })

    const updated = await Promise.all([
      this.httpService.put(`users/${user.id}`, updatedUserData),
      Object.keys(metadata).length && this.httpService.put(`users/${user.id}/metadata`, { metadata, upsert: true }),
    ])

    return !!updated
  }

  async deactivateUser(userId: string): Promise<boolean> {
    const deactivated = await this.httpService.put(`users/${userId}`, { is_active: false })
    return !!deactivated
  }

  async getAccessToken(userId: string): Promise<string> {
    const { data } = await this.httpService.put(`users/${userId}`, { issue_access_token: true })
    return data.access_token
  }

  async deleteUser(userId: string): Promise<boolean> {
    const deleted = await this.httpService.delete(`users/${userId}`)
    return !!deleted
  }

  async getGroupChannel(channelUrl: string): Promise<GroupChannel | null> {
    return this.httpService
      .get<GroupChannel>(`group_channels/${channelUrl}`)
      .catch(() => Promise.resolve(null))
      .then((response) => {
        if (!response) return null
        return response.data
      })
  }

  async sendPostReactionMessage(postReactionId: string): Promise<true | Error> {
    const postReaction = await this.prismaService.postReaction.findUnique({
      where: { id: postReactionId },
      select: {
        authorId: true,
        reaction: true,
        post: {
          select: {
            id: true,
            text: true,
            authorId: true,
            tags: {
              select: {
                id: true,
                text: true,
                isLive: true,
              },
            },
          },
        },
      },
    })

    if (!postReaction) return Promise.reject(new Error('No post reaction'))

    const { authorId, post, reaction } = postReaction

    const userIds = [authorId, post.authorId]
    const channelUrl = buildChannelUrl(userIds)

    // eslint-disable-next-line functional/no-try-statement
    try {
      const groupChannel = await this.getGroupChannel(channelUrl)

      if (!groupChannel) {
        // eslint-disable-next-line functional/no-expression-statement
        await this.httpService.post('group_channels', {
          user_ids: userIds,
          channel_url: channelUrl,
          custom_type: '1-1',
          is_distinct: true,
          inviter_id: authorId,
        })
      }

      // eslint-disable-next-line functional/no-expression-statement
      await this.httpService.post(`group_channels/${channelUrl}/messages`, {
        message_type: 'MESG',
        custom_type: 'post_reaction',
        user_id: authorId,
        message: reaction,
        data: JSON.stringify({
          postId: post.id,
          text: post.text,
          tags: post.tags,
        }),
      })
    } catch (error) {
      return new Error('Was not able to create or send message to the channel')
    }
    return true
  }
}
