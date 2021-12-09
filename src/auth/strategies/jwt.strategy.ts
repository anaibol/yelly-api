import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'
import { PrismaService } from '../../core/prisma.service'
import { AuthUser } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: any): Promise<AuthUser> {
    const id = payload.sub

    // const user = await this.prismaService.user.findUnique({
    //   where: { id: id },
    //   select: { email: true },
    // })

    // if (
    //   !user ||
    //   (process.env.ADMIN_MODE === 'true' && process.env.NODE_ENV === 'production' && !user.email.endsWith('@yelly.app'))
    // ) {
    //   return null
    // }

    return { id }
  }
}
