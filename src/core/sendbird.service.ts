import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'
import { PrismaService } from './prisma.service'

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

  async createUser(user) {
    const profileUrl = user.pictureId ? 'http://yelly.imgix.net/' + user.pictureId + '?format=auto' : ''
    const response = await this.client.post('/v3/users', {
      user_id: this.prismaService.mapBufferIdToString(user.id),
      nickname: user.firstName,
      profile_url: profileUrl,
      issue_access_token: true,
      metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
      },
    })

    return response.data
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
