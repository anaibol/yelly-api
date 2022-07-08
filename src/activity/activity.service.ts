import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../core/prisma.service'
import { mapPost, PostSelectWithParent } from '../post/post-select.constant'
import { tagSelect } from '../tag/tag-select.constant'
import { Activities } from './activity.model'

@Injectable()
export class ActivityService {
  constructor(private prismaService: PrismaService) {}
  async getActivities(userId: string, limit: number, after?: bigint): Promise<Activities> {
    const where: Prisma.ActivityWhereInput = {
      userId,
      date: new Date(),
    }

    const [totalCount, activities] = await Promise.all([
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
          tag: {
            select: tagSelect,
          },
          post: {
            select: PostSelectWithParent,
          },
        },
      }),
    ])

    const items = activities.map(({ post, tag, ...activity }) => ({
      post: post ? mapPost(post) : null,
      tag: {
        postCount: tag._count.posts,
        reactionsCount: tag._count.reactions,
        ...tag,
      },
      ...activity,
    }))

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }
}
