/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-throw-statement */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { FeedEvent, Prisma } from '@prisma/client'
import { differenceInHours, sub } from 'date-fns'
import { findLastIndex, sampleSize, sortBy, uniq } from 'lodash'
import { TrendsFeed } from './trends-feed.model'
import { tagSelect } from '../tag/tag-select.constant'
import { excludedTags } from '../tag/excluded-tags.constant'
import { PaginatedTags } from '../tag/paginated-tags.model'

function isNotNull<T>(argument: T | null): argument is T {
  return argument !== null
}

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

const getPostScore = (authUser: AuthUser, postEvents: FeedEventPayload[]): number => {
  const score: number = postEvents
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
    authUser,
    skip,
    limit,
    postLimit,
  }: {
    authUser: AuthUser
    skip: number
    limit: number
    postLimit: number
  }): Promise<PaginatedTags> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const trendsQuery = Prisma.sql`
      SELECT
        T."id",
        COUNT(*) as "newPostCount"
      FROM
        "Tag" T,
        "_PostToTag" PT,
        "Post" P
      WHERE
        T. "isEmoji" = false
        AND PT. "B" = T. "id"
        AND PT. "A" = P. "id"
        AND P."createdAt" > ${sub(new Date(), {
          days: 1,
        })} AND P."createdAt" < ${new Date()}
      GROUP BY T."id"
      ORDER BY "newPostCount" desc
      OFFSET ${skip}
      LIMIT ${limit / 2}
    `

    const trends = await this.prismaService.$queryRaw<{ id: string }[]>(trendsQuery)
    const trendsTagsIds = trends.map(({ id }) => id)
    const tags = await this.prismaService.tag.findMany({
      where: {
        isHidden: false,
        countryId: country.id,
        OR: [
          {
            createdAt: sub(new Date(), {
              days: 1,
            }),
          },
          {
            id: {
              in: trendsTagsIds,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: tagSelect,
      take: limit,
      skip,
    })

    const items = sampleSize(
      tags.map(({ _count, ...tag }) => ({
        ...tag,
        postCount: _count.posts,
      })),
      tags.length
    )

    const nextSkip = skip + limit

    return { items, nextSkip: tags.length === limit ? nextSkip : 0 }
  }

  // async getTrendsFeed({
  //   skip,
  //   limit,
  //   authUser,
  //   postLimit,
  // }: {
  //   authUser: AuthUser
  //   skip: number
  //   limit: number
  //   postLimit: number
  // }): Promise<TrendsFeed> {
  //   if (!authUser.schoolId) return Promise.reject(new Error('No school'))

  //   const getAuthUserCountry = this.prismaService.school
  //     .findUnique({
  //       where: { id: authUser.schoolId },
  //     })
  //     .city()
  //     .country()

  //   const getFeedEvents = this.prismaService.feedEvent.findMany({
  //     where: {
  //       OR: [
  //         {
  //           type: {
  //             not: 'TREND_SEEN',
  //           },
  //         },
  //         {
  //           userId: authUser.id,
  //         },
  //       ],
  //       createdAt: {
  //         gt: sub(new Date(), { days: 1 }),
  //       },
  //       tag: {
  //         isEmoji: false,
  //         isHidden: false,
  //       },
  //     },
  //     include: FeedEventsInclude,
  //   })

  //   const [authUserCountry, feedEvents] = await Promise.all([getAuthUserCountry, getFeedEvents])

  //   if (!authUserCountry) return Promise.reject(new Error('No country'))

  //   // GET UNIQUE TAGS
  //   const tagIds = uniq(feedEvents.map((e) => e.tagId))

  //   // GROUP EVENTS BY TAG
  //   const tagsWithEventsAndPosts = tagIds
  //     .map((tagId) => {
  //       // GET EVENTS FOR TAG
  //       const tagEvents = feedEvents.filter((e) => e.tagId === tagId)

  //       // GET LAST TREND SEEN EVENT
  //       const lastTrendSeenEventIndex = findLastIndex(tagEvents, (e) => e.type === 'TREND_SEEN')

  //       // GET ALL EVENTS AFTER LAST SEEN EVENT
  //       const events = tagEvents.slice(lastTrendSeenEventIndex + 1, tagEvents.length)

  //       if (!events.length) return null

  //       const postIds = uniq(events.map((e) => e.postId)).filter(isNotNull)

  //       return {
  //         tagId,
  //         events,
  //         postIds,
  //       }
  //     })
  //     .filter(isNotNull)

  //   // const lastEventCreatedAt =
  //   // notSeenEvents.length > 0
  //   //     ? notSeenEvents
  //   //         .map((e) => e.createdAt)
  //   //         .flat()
  //   //         .reduce((a, b) => {
  //   //           return a > b ? a : b
  //   //         })
  //   //     : new Date()

  //   const [posts, tags] = await Promise.all([
  //     this.prismaService.post.findMany({
  //       where: {
  //         id: {
  //           in: tagsWithEventsAndPosts.map(({ postIds }) => postIds).flat(),
  //         },
  //         author: {
  //           school: {
  //             city: {
  //               countryId: authUserCountry.id,
  //             },
  //           },
  //         },
  //       },
  //       select: PostSelectWithParent,
  //     }),
  //     this.prismaService.tag.findMany({
  //       where: {
  //         id: {
  //           in: tagsWithEventsAndPosts.map(({ tagId }) => tagId),
  //         },
  //       },
  //       include: {
  //         posts: {
  //           take: 1,
  //           orderBy: {
  //             createdAt: 'asc',
  //           },
  //           include: {
  //             author: true,
  //           },
  //         },
  //       },
  //     }),
  //   ])

  //   // function isDefined<T>(argument: T | undefined): argument is T {
  //   //   return argument !== undefined
  //   // }

  //   // const usersIds = postsWithEvents
  //   //   .map((p) =>
  //   //     p.events.map((e) => {
  //   //       if (e.type === 'POST_REACTION_CREATED') return e.postReaction?.author.id
  //   //       if (e.type === 'POST_REPLY_CREATED') return e.post?.author.id
  //   //       if (e.type === 'POST_CREATED') return e.post?.author.id
  //   //     })
  //   //   )
  //   //   .flat()
  //   //   .filter(isDefined)

  //   // const followed = await this.prismaService.user.findMany({
  //   //   where: {
  //   //     id: {
  //   //       in: usersIds,
  //   //     },
  //   //     followers: {
  //   //       some: {
  //   //         userId: authUser.id,
  //   //       },
  //   //     },
  //   //   },
  //   // })

  //   // const followedIds = followed.map((f) => f.id)

  //   // const followedByFollowees = await this.prismaService.user.findMany({
  //   //   where: {
  //   //     id: {
  //   //       in: usersIds,
  //   //     },
  //   //     followers: {
  //   //       some: {
  //   //         followee: {
  //   //           userId: {
  //   //             in: authUser.id,
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //   },
  //   // })

  //   // const followedByFolloweesIds = followedByFollowees.map((f) => f.id)

  //   const scoredTags = tagsWithEventsAndPosts.map(({ tagId, postIds, events }) => {
  //     const mappedPosts = posts.map(mapPost)

  //     const postsWithScore = mappedPosts
  //       .filter((p) => postIds.includes(p.id))
  //       .filter(
  //         (post) =>
  //           post.createdAt &&
  //           post.createdAt <
  //             sub(new Date(), {
  //               hours: 1,
  //             })
  //       )
  //       .map((post) => {
  //         // const isPostAuthorFollowed = followedIds.includes(post.author.id)
  //         // const isPostAuthorFollowedByFollowee = followedByFolloweesIds.includes(post.author.id)

  //         const feedEvents = events.filter((e) => e.postId === post.id)

  //         const score = getPostScore(authUser, feedEvents)

  //         return {
  //           post,
  //           score,
  //         }
  //       })

  //     // GET POSTS CREATED LESS THAN AN HOUR AGO
  //     const recentPosts = mappedPosts.filter(
  //       (post) =>
  //         post.createdAt &&
  //         post.createdAt >
  //           sub(new Date(), {
  //             hours: 1,
  //           })
  //     )

  //     const scoredPosts = sortBy(postsWithScore, 'score')

  //     const currentTag = tags.find((t) => t.id === tagId)

  //     if (!currentTag) throw new Error('No tag')

  //     const {
  //       posts: [{ author }],
  //       ...tag
  //     } = currentTag

  //     return {
  //       tag: {
  //         ...tag,
  //         author,
  //       },
  //       score: scoredPosts.reduce((partialSum, { score }) => partialSum + score, 0),
  //       posts: [...recentPosts, ...scoredPosts.map(({ post }) => post)].slice(0, postLimit),
  //     }
  //   })

  //   const nextSkip = skip + limit

  //   const items = sortBy(scoredTags, 'score').map(({ tag, posts: tagPosts }) => {
  //     // const lastItem = tagPosts.length === limit ? tagPosts[limit - 1] : null

  //     // const nextCursor = lastItem ? lastItem.id : ''

  //     return {
  //       ...tag,
  //       postCount: tagPosts.length,
  //       posts: {
  //         items: tagPosts,
  //         nextCursor: '',
  //       },
  //     }
  //   })

  //   return { items, nextSkip }
  // }

  async markTrendAsSeen(authUser: AuthUser, tagId: string, cursor: string): Promise<boolean> {
    await this.prismaService.feedEvent.create({
      data: {
        userId: authUser.id,
        type: 'TREND_SEEN',
        tagId,
        cursor,
      },
    })

    return true
  }
}
