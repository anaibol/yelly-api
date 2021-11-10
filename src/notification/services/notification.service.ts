import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async countUnreadNotifications(userTargetid: Buffer) {
    return this.prismaService.notification.count({
      where: {
        userTargetid: userTargetid,
        isSeen: false,
      },
    })
  }
}
