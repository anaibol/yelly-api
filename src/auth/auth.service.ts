import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Token } from '../user/token.model'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (user && (await this.checkPassword(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.email }

    const token: Token = {
      accessToken: this.jwtService.sign(payload),
    }
    return token
  }

  async checkPassword(plaintextPassword, hashPassword) {
    return await bcrypt.compareSync(plaintextPassword, hashPassword)
  }
}
