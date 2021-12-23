import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'

import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

export type AuthUser = { id: string } | null

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private readonly jwtService: JwtService) {}

  async validateFirebaseUser(accessToken: string): Promise<AuthUser> {
    // decode firebase token

    // check if user exists

    // if user return user

    // else return null

    return null
  }

  async validateUser(email: string, password: string): Promise<AuthUser> {
    if (process.env.ADMIN_MODE === 'true' && process.env.NODE_ENV === 'production' && !email.endsWith('@yelly.app'))
      return null

    const user = await this.prismaService.user.findUnique({ where: { email }, select: { password: true, id: true } })

    if (!user) return null

    const hash = user.password.replace('$2y$', '$2b$')
    if (!(await bcrypt.compare(password, hash))) return null

    return { id: user.id }
  }

  async getAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId, role: 'user' }

    return this.jwtService.sign(payload)
  }
}
