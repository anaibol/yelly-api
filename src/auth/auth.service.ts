import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/services/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Token } from '../user/models/token.model'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(email)

    const user = await this.usersService.findByEmail(email)

    if (user && (await this.checkPassword(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id }

    const token: Token = {
      accessToken: this.jwtService.sign(payload),
    }
    return token
  }

  async checkPassword(plaintextPassword, hashPassword) {
    return await bcrypt.compareSync(plaintextPassword, hashPassword)
  }
}
