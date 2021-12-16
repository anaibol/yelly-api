import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma.service'

@Injectable()
export class ExpoPushNotificationsTokenService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, token: string): Promise<boolean> {
    await this.prismaService.expoPushNotificationAccessToken.upsert({
      where: {
        token,
      },
      update: {
        userId,
      },
      create: {
        userId,
        token,
      },
      select: {
        id: true,
      },
    })
    return true
  }
}
