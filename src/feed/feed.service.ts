/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-throw-statement */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { FeedEvent, Prisma } from '@prisma/client'
import { differenceInHours, sub } from 'date-fns'
import { sampleSize, orderBy, uniq } from 'lodash'
import { TrendsFeed } from './trends-feed.model'
import { tagSelect } from '../tag/tag-select.constant'
import { PaginatedTags } from '../tag/paginated-tags.model'

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

const getPostCreationScore = (event: FeedEvent, scoreParams: ScoreParams): number => {
  if (
    event?.type === 'POST_CREATED' &&
    event.createdAt >
      sub(new Date(), {
        hours: 1,
      })
  ) {
    return event.createdAt.getTime()
  }

  const X = getPostCreationScoreX(scoreParams)

  return 100 * (1 - differenceInHours(event.createdAt, new Date()) / X)
}

const getPostActivityScore = (event: FeedEvent, y: number, scoreParams: ScoreParams): number => {
  const X = getPostActivityScoreX(scoreParams)

  return y * Math.exp(X * (-differenceInHours(event.createdAt, new Date()) / 24))
}

const getEventScore = (event: FeedEvent, authUser: AuthUser): number => {
  const { type } = event

  if (type === 'POST_CREATED') {
    if (!authUser.birthdate || !event.postAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postAuthorBirthdate.getFullYear()

    return getPostCreationScore(event, {
      sameSchool,
      sameYearOrOlder,
    })
  }
  if (type === 'POST_REPLY_CREATED') {
    if (!authUser.birthdate || !event.postAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postAuthorBirthdate.getFullYear()

    return getPostActivityScore(event, 15, {
      sameSchool,
      sameYearOrOlder,
    })
  }

  if (type === 'POST_REACTION_CREATED') {
    if (!authUser.birthdate || !event.postReactionAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postReactionAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postReactionAuthorBirthdate.getFullYear()

    return getPostActivityScore(event, 7.5, {
      sameSchool,
      sameYearOrOlder,
    })
  }

  return 0
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
        subquery."id",
        subquery."newPostCount"
      FROM (
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
          })} 
        GROUP BY T."id"
        ORDER BY "newPostCount" desc
      ) subquery
      WHERE "newPostCount" > 2
      OFFSET ${skip}
      LIMIT ${limit / 2}
    `

    const recentTagsQuery = Prisma.sql`
      SELECT 
        subquery."id",
        subquery."postCount"
      FROM (
        SELECT
          T."id",
          COUNT(*) as "postCount"
        FROM
          "Tag" T,
          "_PostToTag" PT,
          "Post" P
        WHERE
          T. "isEmoji" = false
          AND PT. "B" = T. "id"
          AND PT. "A" = P. "id"
          AND T."createdAt" > ${sub(new Date(), {
            days: 1,
          })} 
        GROUP BY T."id"
      ) subquery
      WHERE "postCount" > 2
      OFFSET ${skip}
      LIMIT ${limit / 2}
    `

    const [trends, recentTags] = await Promise.all([
      this.prismaService.$queryRaw<{ id: string }[]>(trendsQuery),
      this.prismaService.$queryRaw<{ id: string }[]>(recentTagsQuery),
    ])

    const trendsTagsIds = uniq([...trends, ...recentTags].map(({ id }) => id))

    const tags = await this.prismaService.tag.findMany({
      where: {
        isHidden: false,
        countryId: country.id,
        id: {
          in: trendsTagsIds,
        },
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

  async getTrendsFeed2({
    skip,
    limit,
    authUser,
    postLimit,
  }: {
    authUser: AuthUser
    skip: number
    limit: number
    postLimit: number
  }): Promise<TrendsFeed> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const getAuthUserCountry = this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    const getTagsWithFeedEvents = await this.prismaService.tag.findMany({
      where: {
        isEmoji: false,
        isHidden: false,
        feedEvents: {
          some: {
            createdAt: {
              gt: sub(new Date(), { days: 1 }),
            },
          },
        },
      },
      select: {
        ...tagSelect,
        feedCursors: {
          where: {
            userId: authUser.id,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
        feedEvents: {
          where: {
            createdAt: {
              gt: sub(new Date(), { days: 1 }),
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            postId: true,
            tagId: true,
            postReactionId: true,
            postReactionAuthorBirthdate: true,
            postAuthorBirthdate: true,
            postReactionAuthorSchoolId: true,
            postAuthorSchoolId: true,
            type: true,
            createdAt: true,
          },
        },
      },
    })

    const [authUserCountry, tagsWithFeedEvents] = await Promise.all([getAuthUserCountry, getTagsWithFeedEvents])

    if (!authUserCountry) return Promise.reject(new Error('No country'))

    // const lastEventCreatedAt =
    //   notSeenEvents.length > 0
    //     ? notSeenEvents
    //         .map((e) => event.createdAt)
    //         .flat()
    //         .reduce((a, b) => {
    //           return a > b ? a : b
    //         })
    //     : new Date()

    // function isDefined<T>(argument: T | undefined): argument is T {
    //   return argument !== undefined
    // }

    // const usersIds = postsWithEvents
    //   .map((p) =>
    //     p.events.map((e) => {
    //       if (e.type === 'POST_REACTION_CREATED') return event.postReaction?.author.id
    //       if (e.type === 'POST_REPLY_CREATED') return event.post?.author.id
    //       if (e.type === 'POST_CREATED') return event.post?.author.id
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

    const scoredTags = tagsWithFeedEvents
      .map(({ feedEvents, feedCursors, ...tag }) => {
        const postIds = uniq(feedEvents.map(({ postId }) => postId))

        const postScores = postIds.map((postId) => {
          const events = feedEvents.filter((event) => event.postId === postId)

          const scores = events.map((event) => {
            const cursor = feedCursors.length > 0 ? feedCursors[0] : null

            if (cursor && event.createdAt <= new Date(cursor.cursor)) return 0

            return getEventScore(event, authUser)
          })

          return {
            postId,
            score: scores.reduce((a, b) => a + b),
          }
        })

        const sortedPostScores = orderBy(postScores, 'score', 'desc').slice(0, 4) // postLimit
        const score = sortedPostScores.map(({ score }) => score).reduce((a, b) => a + b)
        const finalPostIds = sortedPostScores.map(({ postId }) => postId)

        return {
          tag,
          score,
          postIds: finalPostIds,
          postScores: sortedPostScores,
          nextCursor: feedEvents[0].createdAt.toISOString(),
        }
      })
      .filter(({ score }) => score > 0)

    const sortedTagScores = orderBy(scoredTags, 'score', 'desc').slice(skip, limit)
    const postIds = scoredTags.map(({ postIds }) => postIds).flat()

    const posts = await this.prismaService.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
      select: PostSelectWithParent,
    })

    const items = sortedTagScores.map(({ tag, score, nextCursor, postIds, postScores }) => {
      const tagPosts = posts.filter((p) => postIds.includes(p.id)).map(mapPost)

      const postCount = posts.length

      return {
        ...tag,
        score,
        nextCursor,
        postCount,
        posts: {
          items: tagPosts.map((p) => ({ ...p, score: postScores.find((s) => s.postId === p.id)?.score })),
          nextCursor: '',
        },
      }
    })

    const nextSkip = skip + limit

    return { items, nextSkip }
  }

  async markTrendAsSeen(authUser: AuthUser, tagId: string, cursor: string): Promise<boolean> {
    await this.prismaService.userFeedCursor.create({
      data: {
        userId: authUser.id,
        tagId,
        cursor,
        createdAt: new Date(cursor),
      },
    })

    return true
  }
}
