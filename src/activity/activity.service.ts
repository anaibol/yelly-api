import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../core/prisma.service'
import { Activities } from './activity.model'

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}
  async getActivities(userId: string, isToday: boolean, limit: number, after?: bigint): Promise<Activities> {
    const where: Prisma.ActivityWhereInput = {
      userId,
      ...(isToday && {
        date: new Date(),
      }),
    }

    const [totalCount, items] = await Promise.all([
      this.prismaService.activity.count({
        where,
      }),
      this.prismaService.activity.findMany({
        where,
        ...(after && {
          cursor: {
            id: after,
          },
          skip: 1,
        }),
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        include: {
          tag: true,
        },
      }),
    ])

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }
}
