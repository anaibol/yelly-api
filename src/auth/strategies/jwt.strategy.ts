import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'
import { AuthUser } from '../auth.service'
import { PrismaService } from 'src/core/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: { sub: string }): Promise<AuthUser | null> {
    const { sub: id } = payload

    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        isActive: true,
        birthdate: true,
      },
    })

    const country = await this.prismaService.user
      .findUnique({
        where: { id },
        select: {
          isActive: true,
        },
      })
      .school()
      .city()
      .country({
        select: { id: true },
      })

    if (!user?.isActive) return null

    return { id, countryId: country?.id, birthdate: user.birthdate }
  }
}
