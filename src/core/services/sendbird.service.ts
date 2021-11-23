import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'
import { User } from 'src/user/models/user.model'

@Injectable()
export class SendbirdService {
  client: Axios

  constructor() {
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
    return await this.client.post('/v3/users', {
      user_id: user.id,
      nickname: user.firstName,
      profile_url: profileUrl,
      issue_access_token: true,
      metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
      },
    })
  }
}
