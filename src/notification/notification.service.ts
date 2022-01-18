import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, currentCursor, limit = DEFAULT_LIMIT) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId,
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1,
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
                firstName: true,
                pictureId: true,
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

    const nextCursor = notifications.length === limit ? notifications[limit - 1].createdAt.getTime().toString() : ''

    const formattedNotifications = notifications.map(({ followship, ...notification }) => ({
      ...notification,
      follower: followship?.follower,
    }))

    return { notifications: formattedNotifications, nextCursor }
  }

  async getUnreadCount(userId: string) {
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

  async createFollowshipNotification(userId: string, followshipId: string) {
    return this.prismaService.notification.create({
      data: {
        userId,
        followshipId,
      },
    })
  }

  async markAsRead(notificationId: string) {
    const update = await this.prismaService.notification.update({
      data: {
        isSeen: true,
      },
      where: {
        id: notificationId,
      },
    })

    return !!update
  }
}
