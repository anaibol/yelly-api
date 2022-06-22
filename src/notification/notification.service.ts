import { Injectable } from '@nestjs/common'
import { getNotExpiredCondition, PostSelectWithParent } from 'src/post/post-select.constant'
import { PrismaService } from '../core/prisma.service'
import { PaginatedNotifications } from './paginated-notifications.model'

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async find(userId: string, skip: number, limit: number): Promise<PaginatedNotifications> {
    const [totalCount, items] = await Promise.all([
      this.prismaService.notification.count({
        where: {
          userId,
        },
      }),
      this.prismaService.notification.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          isSeen: true,
          postReaction: {
            select: {
              id: true,
              text: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  pictureId: true,
                },
              },
              post: {
                select: {
                  id: true,
                },
              },
            },
          },
          followRequest: {
            select: {
              id: true,
              status: true,
              requester: {
                select: {
                  id: true,
                  firstName: true,
                  pictureId: true,
                },
              },
              toFollowUser: {
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
        skip,
        take: limit,
      }),
    ])

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
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
