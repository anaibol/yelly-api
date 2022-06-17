/* eslint-disable functional/no-throw-statement */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { FeedEvent, Prisma } from '@prisma/client'
import { differenceInHours, sub } from 'date-fns'
import { sampleSize, orderBy, uniq, groupBy } from 'lodash'
import { TrendsFeed } from './trends-feed.model'
import { tagSelect } from '../tag/tag-select.constant'
import { PaginatedTags } from '../tag/paginated-tags.model'

type ScoreParams = {
  followed?: boolean
  followedByFollowee?: boolean
  sameSchool: boolean
  sameYearOrOlder: boolean
}

function isNotNull<TValue>(value: TValue | null): value is TValue {
  return value !== null
}

function isDefined<TValue>(value: TValue | undefined): value is TValue {
  return value !== undefined
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
  const X = getPostCreationScoreX(scoreParams)

  return 100 * (1 - differenceInHours(event.createdAt, new Date()) / X)
}

const getPostActivityScore = (event: FeedEvent, y: number, scoreParams: ScoreParams): number => {
  const X = getPostActivityScoreX(scoreParams)

  return y * Math.exp(X * (-differenceInHours(event.createdAt, new Date()) / 24))
}

const getEventScore = (event: FeedEvent, authUser: AuthUser, cursor: string | null): number => {
  const { type } = event

  const cursorFactor = cursor && event.createdAt <= new Date(cursor) ? 100 : 1

  if (type === 'POST_CREATED') {
    if (!authUser.birthdate || !event.postAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postAuthorBirthdate.getFullYear()

    const createdLessThanAnHourAgoMultiplier =
      event?.type === 'POST_CREATED' &&
      event.createdAt >
        sub(new Date(), {
          hours: 1,
        })
        ? 100
        : 1

    return (
      getPostCreationScore(event, {
        sameSchool,
        sameYearOrOlder,
      }) *
      cursorFactor *
      createdLessThanAnHourAgoMultiplier
    )
  }
  if (type === 'POST_REPLY_CREATED') {
    if (!authUser.birthdate || !event.postAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postAuthorBirthdate.getFullYear()

    return (
      getPostActivityScore(event, 15, {
        sameSchool,
        sameYearOrOlder,
      }) * cursorFactor
    )
  }

  if (type === 'POST_REACTION_CREATED') {
    if (!authUser.birthdate || !event.postReactionAuthorBirthdate) throw new Error('No birthdate')

    const sameSchool = authUser.schoolId === event.postReactionAuthorSchoolId
    const sameYearOrOlder = authUser.birthdate.getFullYear() >= event.postReactionAuthorBirthdate.getFullYear()

    return (
      getPostActivityScore(event, 7.5, {
        sameSchool,
        sameYearOrOlder,
      }) * cursorFactor
    )
  }

  return 0
}

@Injectable()
export class FeedService {
  constructor(private prismaService: PrismaService) {}
  async getFeed(authUser: AuthUser, limit: number, currentCursor?: bigint, isSeen?: boolean): Promise<Feed> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

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
        countryId: authUser.countryId,
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
    const tags = await this.prismaService.tag.findMany({
      where: {
        countryId: authUser.countryId,
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

    const scoredTags = tags
      .map(({ feedEvents, feedCursors, ...tag }) => {
        const cursor = feedCursors.length > 0 ? feedCursors[0] : null

        const tagScores = feedEvents.map((event) => ({
          ...event,
          score: Math.round(getEventScore(event, authUser, cursor ? cursor.cursor : null)),
        }))

        const eventsByPost = groupBy(tagScores, (tagScore) => tagScore.postId)

        const posts = Object.entries(eventsByPost).map(([id, events]) => ({
          id,
          score: events.reduce<number>((currentScore, { score }) => currentScore + score, 0),
        }))

        if (!posts.length) return null

        const sortedPosts = orderBy(posts, 'score', 'desc').slice(0, postLimit)

        const score = sortedPosts.reduce<number>((currentScore, { score }) => currentScore + score, 0)

        return {
          tag,
          score,
          posts: sortedPosts,
          nextCursor: feedEvents[0].createdAt.toISOString(),
        }
      })
      .filter(isNotNull)
      .filter(({ score }) => score > 0)

    const sortedTagScores = orderBy(scoredTags, 'score', 'desc').slice(skip, limit)

    const allPostIds = scoredTags.map(({ posts }) => posts.map(({ id }) => id)).flat()

    const allPosts = await this.prismaService.post.findMany({
      where: {
        id: {
          in: allPostIds,
        },
      },
      select: PostSelectWithParent,
    })

    const items = sortedTagScores.map(({ tag, score, nextCursor, posts }) => {
      const tagPosts = posts
        .map(({ id, score }) => {
          const post = allPosts.find((p) => id === p.id)

          if (post) return { ...mapPost(post), score }
        })
        .filter(isDefined)

      const postCount = posts.length

      return {
        ...tag,
        score,
        nextCursor,
        postCount,
        posts: {
          items: tagPosts,
          nextCursor: '',
        },
      }
    })

    const nextSkip = skip + limit

    return { items, nextSkip }
  }

  async markTrendAsSeen(authUser: AuthUser, tagId: string, cursor: string): Promise<boolean> {
    await this.prismaService.userFeedCursor.upsert({
      where: {
        tagId_userId: {
          tagId,
          userId: authUser.id,
        },
      },
      create: {
        userId: authUser.id,
        tagId,
        cursor,
        createdAt: new Date(cursor),
      },
      update: {
        cursor,
        createdAt: new Date(cursor),
      },
    })

    return true
  }
}
