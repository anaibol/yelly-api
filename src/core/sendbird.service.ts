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
    birthdate: Date
  }
}

type IncomingUser = {
  id: string
  firstName: string
  lastName: string
  pictureId: string
  birthdate: Date
}

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
    const profileUrl = user.pictureId && 'http://yelly.imgix.net/' + user.pictureId + '?format=auto'

    const sendbirdUser: SendbirdUser = {
      user_id: user.id,
      nickname: user.firstName + ' ' + user.lastName,
      profile_url: profileUrl,
      issue_access_token: true,
      metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
      },
    }

    const { data } = await this.client.post('/v3/users', sendbirdUser)

    return data.access_token
  }

  updateUser(user: Partial<IncomingUser>) {
    const profileUrl = user.pictureId && `http://yelly.imgix.net/${user.pictureId}/?format=auto`

    const metadata = cleanUndefinedFromObj({
      firstName: user.firstName,
      lastName: user.lastName,
      pictureId: user.pictureId,
    })

    const updatedUserData: Partial<SendbirdUser> = {
      ...cleanUndefinedFromObj({
        profile_url: profileUrl,
        ...(Object.keys(metadata).length && {
          nickname: `${user.firstName} ${user.lastName}`,
          metadata,
        }),
      }),
    }

    return this.client.put(`/v3/users/${user.id}`, updatedUserData)
  }

  async getAccessToken(userId: string) {
    const response = await this.client.put(`/v3/users/${userId}`, { issue_access_token: true })
    return response.data.access_token
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.client.delete(`/v3/users/${userId}`)
    return true
  }
}
