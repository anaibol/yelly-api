/* eslint-disable functional/no-let */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { excludedTags } from 'src/tag/excluded-tags.constant'
import { Feed, FeedItem } from './feed.model'

@Injectable()
export class FeedService {
  constructor(private prismaService: PrismaService) {}
  async getFeed(authUser: AuthUser, limit: number, currentCursor?: string): Promise<Feed> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!authUserCountry) return Promise.reject(new Error('No country'))

    const feedItems = await this.prismaService.feedItem.findMany({
      where: {
        userId: authUser.id,
        isSeen: false,
        post: {
          ...getNotExpiredCondition(),
          author: {
            isActive: true,
          },
          OR: [
            {
              parent: null,
            },
            {
              parent: {
                parent: null,
              },
            },
          ],
          tags: {
            none: {
              text: {
                in: excludedTags,
                mode: 'insensitive',
              },
            },
          },
        },
      },
      ...(currentCursor && {
        cursor: {
          id: currentCursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        post: {
          select: PostSelectWithParent,
        },
      },
    })

    const mappedPosts = feedItems.map(({ post, ...feedItem }) => ({
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

    const nextCursor = lastItem ? lastItem.id : ''

    return { items, nextCursor }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.prismaService.feedItem.count({
      where: {
        userId,
        isSeen: false,
      },
    })
  }

  async markAsSeen(authUser: AuthUser, after: Date, before: Date): Promise<boolean> {
    const update = await this.prismaService.feedItem.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        userId: '45a3f764-dc40-4c47-9345-afa43d60cf00',
        createdAt: {
          gte: after,
          lte: before,
        },
      },
    })

    return !!update
  }
}
