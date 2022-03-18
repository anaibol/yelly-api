import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'
import { AuthUser } from '../auth.service'
import { PrismaService } from 'src/core/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: { readonly sub: string }): Promise<AuthUser | null> {
    const { sub: id } = payload

    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user?.isActive) return null

    return user
  }
}
