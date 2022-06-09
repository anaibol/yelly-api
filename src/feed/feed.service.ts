/* eslint-disable functional/no-throw-statement */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { FeedEvent, Prisma } from '@prisma/client'
import { differenceInHours, sub } from 'date-fns'
import { excludedTags } from '../tag/excluded-tags.constant'
import { PaginatedTags } from '../tag/paginated-tags.model'
import { uniqBy } from 'lodash'

const FeedEventsInclude = {
  post: {
    include: {
      author: true,
      parent: {
        include: {
          author: true,
        },
      },
    },
  },
  postReaction: {
    include: {
      author: true,
    },
  },
}

type FeedEventPayload = Prisma.FeedEventGetPayload<{
  include: typeof FeedEventsInclude
}>

type ScoreParams = {
  followed?: boolean
  followedByFollowee?: boolean
  sameSchool: boolean
  sameYearOrOlder: boolean
}

const getPostCreationScoreX = ({
  followed = false,
  followedByFollowee = false,
  sameSchool,
  sameYearOrOlder,
}: ScoreParams): number => {
  if (followed || sameSchool) return 60
  if (followedByFollowee) return 48
  if (sameYearOrOlder) return 36

  return 24
}

const getPostActivityScoreX = ({ followed, followedByFollowee, sameSchool, sameYearOrOlder }: ScoreParams): number => {
  if (followed || sameSchool) return 1
  if (followedByFollowee) return 1
  if (sameYearOrOlder) return 3

  return 4
}

const getPostCreationScore = (e: FeedEvent, scoreParams: ScoreParams): number => {
  const X = getPostCreationScoreX(scoreParams)

  return 100 * (1 - differenceInHours(e.createdAt, new Date()) / X)
}

const getPostActivityScore = (e: FeedEvent, y: number, scoreParams: ScoreParams): number => {
  const X = getPostActivityScoreX(scoreParams)

  return y * Math.exp(X * (-differenceInHours(e.createdAt, new Date()) / 24))
}

const getPostScore = (authUser: AuthUser, feedEvents: FeedEventPayload[]): number => {
  if (feedEvents.some((e) => e.userId === authUser.id && e.type === 'TREND_SEEN')) return 0

  const score: number = feedEvents
    .map((e) => {
      const { type } = e

      if (type === 'POST_CREATED') {
        if (!authUser.birthdate || !e.post?.author.birthdate) throw new Error('No birthdate')

        const sameSchool = authUser.schoolId === e.post?.author.schoolId
        const sameYearOrOlder = authUser.birthdate.getFullYear() >= e.post?.author.birthdate?.getFullYear()

        return getPostCreationScore(e, {
          sameSchool,
          sameYearOrOlder,
        })
      }
      if (type === 'POST_REPLY_CREATED') {
        if (!authUser.birthdate || !e.post?.parent?.author.birthdate) throw new Error('No birthdate')

        const sameSchool = authUser.schoolId === e.post?.parent?.author.schoolId
        const sameYearOrOlder = authUser.birthdate.getFullYear() >= e.post?.parent?.author.birthdate.getFullYear()

        return getPostActivityScore(e, 15, {
          sameSchool,
          sameYearOrOlder,
        })
      }

      if (type === 'POST_REACTION_CREATED') {
        if (!authUser.birthdate || !e.postReaction?.author.birthdate) throw new Error('No birthdate')

        const sameSchool = authUser.schoolId === e.postReaction?.author.schoolId
        const sameYearOrOlder = authUser.birthdate.getFullYear() >= e.postReaction?.author.birthdate.getFullYear()

        return getPostActivityScore(e, 7.5, {
          sameSchool,
          sameYearOrOlder,
        })
      }

      return 0
    })
    .reduce((partialSum, a) => partialSum + a, 0)

  return score
}

@Injectable()
export class FeedService {
  constructor(private prismaService: PrismaService) {}
  async getFeed(authUser: AuthUser, limit: number, currentCursor?: bigint, isSeen?: boolean): Promise<Feed> {
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

    const [totalCount, feedItems] = await Promise.all([
      this.prismaService.feedItem.count({
        where,
      }),
      this.prismaService.feedItem.findMany({
        where,
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
          createdAt: true,
          post: {
            select: PostSelectWithParent,
          },
        },
      }),
    ])

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

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.prismaService.feedItem.count({
      where: {
        userId,
        isSeen: false,
      },
    })
  }

  async markAsSeen(authUser: AuthUser, after?: Date, before?: Date, feedItemId?: bigint): Promise<boolean> {
    const update = await this.prismaService.feedItem.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        isSeen: false,
        userId: authUser.id,
        ...(feedItemId && {
          id: feedItemId,
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

    if (feedItemId && !update.count) return Promise.reject(new Error('feedItemId not found'))

    return !!update
  }

  async getTrendsFeed({
    skip,
    limit,
    authUser,
    postLimit,
  }: {
    authUser: AuthUser
    skip: number
    limit: number
    postLimit: number
  }): Promise<PaginatedTags> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!authUserCountry) return Promise.reject(new Error('No country'))

    const postsWithEvents = await this.prismaService.post.findMany({
      where: {
        author: {
          school: {
            city: {
              countryId: authUserCountry.id,
            },
          },
        },
        feedEvents: {
          some: {},
          every: {
            createdAt: {
              gt: sub(new Date(), { days: 1 }),
            },
            tag: {
              isEmoji: false,
            },
          },
          // tags: {
          //   none: {
          //     text: {
          //       in: excludedTags,
          //       mode: 'insensitive',
          //     },
          //   },
          // },
          // none: {
          //   tag: {
          //     text: {
          //       notIn: excludedTags,
          //       mode: 'insensitive',
          //     },
          //     postEvent: {
          //       none: {
          //         type: {
          //           not: 'TREND_SEEN',
          //         },
          //       },
          //     },
          //   },
          // },
        },
      },
      select: {
        ...PostSelectWithParent,
        feedEvents: {
          include: FeedEventsInclude,
        },
      },
    })

    // function isDefined<T>(argument: T | undefined): argument is T {
    //   return argument !== undefined
    // }

    // const usersIds = postsWithEvents
    //   .map((p) =>
    //     p.events.map((e) => {
    //       if (e.type === 'POST_REACTION_CREATED') return e.postReaction?.author.id
    //       if (e.type === 'POST_REPLY_CREATED') return e.post?.author.id
    //       if (e.type === 'POST_CREATED') return e.post?.author.id
    //     })
    //   )
    //   .flat()
    //   .filter(isDefined)

    // const followed = await this.prismaService.user.findMany({
    //   where: {
    //     id: {
    //       in: usersIds,
    //     },
    //     followers: {
    //       some: {
    //         userId: authUser.id,
    //       },
    //     },
    //   },
    // })

    // const followedIds = followed.map((f) => f.id)

    // const followedByFollowees = await this.prismaService.user.findMany({
    //   where: {
    //     id: {
    //       in: usersIds,
    //     },
    //     followers: {
    //       some: {
    //         followee: {
    //           userId: {
    //             in: authUser.id,
    //           },
    //         },
    //       },
    //     },
    //   },
    // })

    // const followedByFolloweesIds = followedByFollowees.map((f) => f.id)

    const scoredPosts = postsWithEvents.map(({ feedEvents, ...post }) => {
      // if (find events by tag(e))
      // e.tag

      // const isPostAuthorFollowed = followedIds.includes(post.author.id)
      // const isPostAuthorFollowedByFollowee = followedByFolloweesIds.includes(post.author.id)

      const score = getPostScore(authUser, feedEvents)

      return {
        ...post,
        score,
      }
    })

    const recentScoredPosts = scoredPosts.filter(
      (post) =>
        post.createdAt >
        sub(new Date(), {
          hours: 1,
        })
    )

    const posts = [...recentScoredPosts, ...scoredPosts]

    const tags = uniqBy(
      posts.map((post) => post.tags[0]),
      'id'
    )

    const nextSkip = skip + limit

    const items = tags.map((tag) => {
      const tagPosts = posts
        .filter((post) => post.tags[0].id === tag.id)
        .map(mapPost)
        .slice(0, postLimit)

      const lastItem = tagPosts.length === limit ? tagPosts[limit - 1] : null

      const nextCursor = lastItem ? lastItem.id : ''

      return {
        ...tag,
        posts: {
          items: tagPosts,
          nextCursor,
        },
      }
    })

    return { items, nextSkip }
  }

  async markTrendAsSeen(authUser: AuthUser, tagId: string, cursor: string): Promise<boolean> {
    await this.prismaService.feedEvent.create({
      data: {
        type: 'TREND_SEEN',
        tagId,
        cursor,
        userId: authUser.id,
      },
    })

    return true
  }
}
