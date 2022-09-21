import { Injectable } from '@nestjs/common'

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
          newPostCount: true,
          tag: {
            select: {
              id: true,
              text: true,
              author: {
                select: {
                  id: true,
                  displayName: true,
                  username: true,
                  pictureId: true,
                  birthdate: true,
                },
              },
            },
          },
          post: {
            select: {
              id: true,
              text: true,
              author: {
                select: {
                  id: true,
                  displayName: true,
                  username: true,
                  pictureId: true,
                  birthdate: true,
                },
              },
            },
          },
          postUserMention: {
            select: {
              id: true,
              post: {
                select: {
                  id: true,
                  text: true,
                  author: {
                    select: {
                      id: true,
                      displayName: true,
                      username: true,
                      pictureId: true,
                      birthdate: true,
                    },
                  },
                },
              },
            },
          },
          postReaction: {
            select: {
              id: true,
              text: true,
              author: {
                select: {
                  id: true,
                  displayName: true,
                  username: true,
                  pictureId: true,
                  birthdate: true,
                },
              },
              post: {
                select: {
                  id: true,
                  text: true,
                  author: {
                    select: {
                      id: true,
                      displayName: true,
                      username: true,
                      pictureId: true,
                      birthdate: true,
                    },
                  },
                },
              },
            },
          },
          followerUser: {
            select: {
              id: true,
              displayName: true,
              username: true,
              pictureId: true,
              birthdate: true,
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

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : null }
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
