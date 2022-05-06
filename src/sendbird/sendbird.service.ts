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

  async revokeAccessTokens(userId: string): Promise<boolean> {
    const banned = await this.httpService.delete(`users/${userId}/token`)
    return !!banned
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
}
