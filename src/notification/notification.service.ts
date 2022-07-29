import { Injectable } from '@nestjs/common'

import { PrismaService } from '../core/prisma.service'
import { getLastResetDate } from '../utils/dates'
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
          createdAt: {
            gte: getLastResetDate(),
          },
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
                  firstName: true,
                  lastName: true,
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
                  firstName: true,
                  lastName: true,
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
                      firstName: true,
                      lastName: true,
                      pictureId: true,
                      birthdate: true,
                    },
                  },
                },
              },
            },
          },
          tagReaction: {
            select: {
              id: true,
              text: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  pictureId: true,
                  birthdate: true,
                },
              },
              tag: {
                select: {
                  id: true,
                  text: true,
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
                  firstName: true,
                  lastName: true,
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
                      firstName: true,
                      lastName: true,
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
              firstName: true,
              lastName: true,
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

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.prismaService.notification.count({
      where: {
        userId,
        isSeen: false,
        createdAt: {
          gte: getLastResetDate(),
        },
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
