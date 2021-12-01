import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username)

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async getAccessToken(userId: string): Promise<string> {
    console.log({ userId })
    const payload = { sub: userId, role: 'user' }

    return this.jwtService.sign(payload)
  }
}
