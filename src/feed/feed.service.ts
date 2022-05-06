import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { Prisma } from '@prisma/client'

@Injectable()
export class FeedService {
  constructor(private prismaService: PrismaService) {}
  async getFeed(authUser: AuthUser, limit: number, currentCursor?: string, isSeen?: boolean): Promise<Feed> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!authUserCountry) return Promise.reject(new Error('No country'))

    const where: Prisma.FeedItemWhereInput = {
      userId: authUser.id,
      ...(isSeen !== undefined && {
        isSeen,
      }),
      post: {
        ...getNotExpiredCondition(),
        author: {
          isActive: true,
        },
      },
    }

    const [totalCount, feedItems] = await this.prismaService.$transaction([
      this.prismaService.feedItem.count({
        where,
      }),
      this.prismaService.feedItem.findMany({
        where,
        ...(currentCursor && {
          cursor: {
            id: BigInt(currentCursor),
          },
          skip: 1,
        }),
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        select: {
          id: true,
          createdAt: true,
          post: {
            select: PostSelectWithParent,
          },
        },
      }),
    ])

    const mappedPosts = feedItems.map(({ post, id, ...feedItem }) => ({
      id: id.toString(),
      ...feedItem,
      ...(post && { post: mapPost(post) }),
    }))

    // eslint-disable-next-line prefer-const
    // let threads: string[] = []

    // const items: FeedItem[] = mappedPosts
    //   .map((item) => {
    //     if (item && item.post && item.post.threadId && !threads.includes(item.post.threadId)) {
    //       // eslint-disable-next-line functional/immutable-data
    //       threads.push(item.post.threadId)
    //       return [
    //         item,
    //         ...mappedPosts.filter((i) => i.post?.threadId === item.post?.threadId && i.post?.id !== item.post?.id),
    //       ]
    //     }

    //     return item
    //   })
    //   .flat()

    const items = mappedPosts

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id.toString() : ''

    return { items, nextCursor, totalCount }
  }

  async markAsSeen(authUser: AuthUser, after?: Date, before?: Date, feedItemId?: string): Promise<boolean> {
    const update = await this.prismaService.feedItem.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        userId: authUser.id,
        ...(feedItemId && {
          id: BigInt(feedItemId),
        }),
        ...(after &&
          before && {
            createdAt: {
              gte: after,
              lte: before,
            },
          }),
      },
    })

    // eslint-disable-next-line functional/no-throw-statement
    if (feedItemId && !update.count) throw new Error('feedItemId not found')

    return !!update
  }
}
