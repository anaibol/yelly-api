import { Injectable } from '@nestjs/common'
import { ExpoPushNotificationAccessToken } from '@prisma/client'
import { PrismaService } from 'src/core/prisma.service'

@Injectable()
export class ExpoPushNotificationsTokenService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, token: string): Promise<ExpoPushNotificationAccessToken> {
    return await this.prismaService.expoPushNotificationAccessToken.upsert({
      where: {
        token: token,
      },
      update: {
        userId,
      },
      create: {
        userId,
        token,
      },
    })
  }
}
