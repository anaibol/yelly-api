import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { PaginatedNotifications } from './paginated-notifications.model'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, currentCursor?: string, limit = DEFAULT_LIMIT): Promise<PaginatedNotifications> {
    const items = await this.prismaService.notification.findMany({
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
            id: true,
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
        friendRequest: {
          select: {
            id: true,
            status: true,
            fromUser: {
              select: {
                id: true,
                firstName: true,
                pictureId: true,
              },
            },
            toUser: {
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

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.prismaService.notification.count({
      where: {
        userId,
        isSeen: false,
      },
    })
  }

  async markAsRead(notificationId: string): Promise<boolean> {
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
