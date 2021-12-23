import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'
import { PrismaService } from './prisma.service'

type SendbirdUser = {
  user_id: string
  nickname: string
  profile_url: string
  issue_access_token: true
  metadata: {
    firstName: string
    lastName: string
    pictureId: string
  }
}

type IncomingUser = {
  id: string
  firstName: string
  lastName: string
  pictureId: string
}

const SAMUEL_ADMIN_ID = process.env.SAMUEL_ADMIN_ID

const cleanUndefinedFromObj = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v === undefined || v === null ? a : ((a[k] = v), a)), {})

@Injectable()
export class SendbirdService {
  client: Axios

  constructor(private prismaService: PrismaService) {
    this.client = axios.create({
      baseURL: process.env.SENDBIRD_BASE_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        'Api-Token': process.env.SENDBIRD_TOKEN,
      },
    })
  }

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

    const { data } = await this.client.post('/v3/users', sendbirdUser)

    this.welcomeMessage(user.id, user.firstName)
    return data.access_token
  }

  async updateUser(user: Partial<IncomingUser>) {
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

    await Promise.all([
      this.client.put(`/v3/users/${user.id}`, updatedUserData),
      Object.keys(metadata).length && this.client.put(`/v3/users/${user.id}/metadata`, { metadata, upsert: true }),
    ])
  }

  async getAccessToken(userId: string): Promise<string> {
    const response = await this.client.put(`/v3/users/${userId}`, { issue_access_token: true })
    return response.data.access_token
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.client.delete(`/v3/users/${userId}`)
    return true
  }

  async welcomeMessage(userId: string, userFirstName: string) {
    const userIds = [userId, SAMUEL_ADMIN_ID]
    const channelUrl = `${userId}_${SAMUEL_ADMIN_ID}`

    try {
      const channel = await this.client.post('/v3/group_channels', {
        user_ids: userIds,
        channel_url: channelUrl,
        name: 'welcome chat',
        custom_type: '1-1',
        is_distinct: true,
        inviter_id: SAMUEL_ADMIN_ID,
      })

      if (channel) {
        await this.client.post(`/v3/group_channels/${channelUrl}/messages`, {
          message_type: 'MESG',
          user_id: SAMUEL_ADMIN_ID,
          message: `Salut ${userFirstName}, 
          Je m'appelle Samuel et c'est moi qui ai crée Yelly 😄 ! Bienvenue sur l'app !
          ça m'aiderait de ouf si tu pouvais me donner quelques conseils ou idées pour l'améliorer. Je prends aussi les critiques !
          Merci !`,
        })
      }
    } catch (error) {
      console.log('error:', error)
    }
    return true
  }
}
