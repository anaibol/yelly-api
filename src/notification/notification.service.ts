import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { PaginatedNotifications } from './paginated-notifications.model'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, skip = 0, limit = DEFAULT_LIMIT): Promise<PaginatedNotifications> {
    const items = await this.prismaService.notification.findMany({
      where: {
        userId,
      },

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
      ...(skip && {
        skip,
      }),
      take: limit,
    })

    const nextSkip = skip + limit

    return { items, nextSkip }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.prismaService.notification.count({
      where: {
        userId,
        isSeen: false,
      },
    })
  }

  async markAsSeen(notificationId: string): Promise<boolean> {
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
