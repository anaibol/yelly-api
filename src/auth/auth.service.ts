import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { AccessToken } from 'src/user/accessToken.model'

import { PrismaService } from '../core/prisma.service'

export type AuthUser = User & {
  isAdmin: boolean
  isNotAdmin: boolean
}

const refreshRole = 'refresh'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}
  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user?.password || !user?.isActive) return null

    const hash = user.password.replace('$2y$', '$2b$')
    if (!(await bcrypt.compare(password, hash))) return null

    return {
      ...user,
      isAdmin: user.role === 'ADMIN',
      isNotAdmin: user.role !== 'ADMIN',
    }
  }

  async getAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId, role: 'user' }

    return this.jwtService.sign(payload, {
      expiresIn: '1d',
    })
  }

  async getRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId, role: 'user' }

    return this.jwtService.sign(payload, {
      expiresIn: '1y',
    })
  }

  async refreshAccessToken(refreshToken: string): Promise<AccessToken> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      const { sub: userId, role } = await this.jwtService.verify(refreshToken, {
        ignoreExpiration: true,
      })

      // TODO: uncomment when front supports refresh access token
      // if (role !== refreshRole) return Promise.reject(new Error('Invalid refresh token role')

      return {
        accessToken: this.jwtService.sign({ sub: userId, role: 'user' }),
        refreshToken: this.jwtService.sign({ sub: userId, role: refreshRole }),
      }
    } catch (error) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new UnauthorizedException(
        JSON.stringify({
          refreshToken,
        })
      )
    }
  }
}
