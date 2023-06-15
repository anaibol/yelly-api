import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma.service'

@Injectable()
export class ExpoPushNotificationsTokenService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, token: string): Promise<boolean> {
    await this.prismaService.expoPushNotificationAccessToken.deleteMany({
      where: {
        token,
      },
    })

    await this.prismaService.expoPushNotificationAccessToken.create({
      data: {
        userId,
        token,
      },
      select: {
        id: true,
      },
    })

    return true
  }

  async deleteByUserAndToken(userId: string, token: string): Promise<boolean> {
    await this.prismaService.expoPushNotificationAccessToken.deleteMany({
      where: {
        userId,
        token,
      },
    })

    return true
  }
}
