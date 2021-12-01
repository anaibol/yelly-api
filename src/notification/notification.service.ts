import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userEmail: string, currentCursor, limit = DEFAULT_LIMIT) {
    const { id: userTargetId } = await this.prismaService.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    })
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userTargetId,
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      select: {
        id: true,
        action: true,
        createdAt: true,
        isSeen: true,
        userSource: {
          select: {
            id: true,
            firstName: true,
            pictureId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    const cursor = notifications.length === limit ? notifications[limit - 1].createdAt : ''
    const mappedNotifications = notifications.map((notification) => this.formatNotification(notification))

    return { notifications: mappedNotifications, cursor }
  }

  async countUnreadNotifications(userTargetId: Buffer) {
    return this.prismaService.notification.count({
      where: {
        userTargetId,
        isSeen: false,
      },
    })
  }

  formatNotification(notification) {
    return {
      ...notification,
      id: this.prismaService.mapBufferIdToString(notification.id),
      userSource: {
        ...notification.userSource,
        id: this.prismaService.mapBufferIdToString(notification.userSource.id),
      },
    }
  }
}
