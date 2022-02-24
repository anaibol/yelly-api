import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'

import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AccessToken } from 'src/user/accessToken.model'

export type AuthUser = { id: string; countryId?: string; birthdate?: Date | null }

const refreshRole = 'refresh'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private readonly jwtService: JwtService) {}
  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { password: true, id: true, isActive: true, birthdate: true },
    })

    if (!user?.password || !user?.isActive) return null

    const country = await this.prismaService.user
      .findUnique({
        where: { id: user.id },
        select: {
          isActive: true,
        },
      })
      .school()
      .city()
      .country({
        select: { id: true },
      })

    const hash = user.password.replace('$2y$', '$2b$')
    if (!(await bcrypt.compare(password, hash))) return null

    return { id: user.id, countryId: country?.id, birthdate: user.birthdate }
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
    try {
      const { sub: userId, role } = await this.jwtService.verify(refreshToken, {
        ignoreExpiration: true,
      })

      // TODO: uncomment when front supports refresh access token
      // if (role !== refreshRole) throw new Error('Invalid refresh token role')

      return {
        accessToken: this.jwtService.sign({ sub: userId, role: 'user' }),
        refreshToken: this.jwtService.sign({ sub: userId, role: refreshRole }),
      }
    } catch (error) {
      throw new UnauthorizedException(
        JSON.stringify({
          refreshToken,
        })
      )
    }
  }
}
