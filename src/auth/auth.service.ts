import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'

import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    const hash = user.password.replace('$2y$', '$2b$')

    if (user && (await bcrypt.compare(password, hash))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async getAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId, role: 'user' }

    return this.jwtService.sign(payload)
  }
}
