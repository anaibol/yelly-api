import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, currentCursor, limit = DEFAULT_LIMIT) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId: userId,
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      select: {
        id: true,
        createdAt: true,
        isSeen: true,
        postReaction: {
          select: {
            reaction: true,
            postId: true,
            author: {
              select: {
                id: true,
              },
            },
          },
        },
        followship: {
          select: {
            follower: {
              select: {
                id: true,
                firstName: true,
                pictureId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    const cursor = notifications.length === limit ? notifications[limit - 1].createdAt : ''

    const formattedNotifications = notifications.map(({ followship, ...notification }) => ({
      ...notification,
      follower: followship.follower,
    }))

    return { notifications: formattedNotifications, cursor }
  }

  async countUnreadNotifications(userId: string) {
    return this.prismaService.notification.count({
      where: {
        userId,
        isSeen: false,
      },
    })
  }

  async upsertPostReactionNotification(userId: string, postReactionId: string) {
    return this.prismaService.notification.upsert({
      where: {
        postReactionId,
      },
      create: {
        userId,
        postReactionId,
      },
      update: {
        userId,
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
