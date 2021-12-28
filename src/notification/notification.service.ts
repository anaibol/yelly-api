import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, currentCursor, limit = DEFAULT_LIMIT) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userTargetId: userId,
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      select: {
        id: true,
        type: true,
        createdAt: true,
        isSeen: true,
        postReaction: {
          select: {
            reaction: true,
            postId: true,
          },
        },
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

    return { notifications, cursor }
  }

  async countUnreadNotifications(userTargetId: string) {
    return this.prismaService.notification.count({
      where: {
        userTargetId,
        isSeen: false,
      },
    })
  }

  async upsertPostReactionNotification(userTargetId: string, userSourceId: string, postReactionId: string) {
    return this.prismaService.notification.upsert({
      where: {
        postReactionId,
      },
      create: {
        userSourceId,
        userTargetId,
        postReactionId,
      },
      update: {
        userSourceId,
        userTargetId,
        postReactionId,
      },
    })
  }

  async updateIsSeenNotification(notificationId: string) {
    this.prismaService.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isSeen: true,
      },
    })
  }
}
