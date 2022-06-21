/* eslint-disable functional/no-throw-statement */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { AuthUser } from 'src/auth/auth.service'

import { Feed } from './feed.model'
import { FeedEvent, Prisma } from '@prisma/client'
import { differenceInHours, differenceInSeconds, sub } from 'date-fns'
import { orderBy } from 'lodash'
import { Trend, PaginatedTrends } from './trend.model'
import { tagSelect } from '../tag/tag-select.constant'

type ScoreParams = {
  followed?: boolean
  followedByFollowee?: boolean
  sameSchool: boolean
  sameYearOrOlder: boolean
}

function isNotNull<TValue>(value: TValue | null): value is TValue {
  return value !== null
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

const diffInHours = (date1: Date, date2: Date) => {
  return -(differenceInSeconds(date1, date2) / 3600)
}

const getPostCreationScore = (event: FeedEvent, scoreParams: ScoreParams): number => {
  const X = getPostCreationScoreX(scoreParams)

  return 100 * (1 - diffInHours(event.createdAt, new Date()) / X)
}

const getPostActivityScore = (event: FeedEvent, y: number, scoreParams: ScoreParams): number => {
  const X = getPostActivityScoreX(scoreParams)

  const A = diffInHours(event.createdAt, new Date()) / 24

  return y * Math.exp(X * A)
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

  async deleteUserFeedCursors(authUser: AuthUser): Promise<boolean> {
    await this.prismaService.userFeedCursor.deleteMany({
      where: {
        userId: authUser.id,
      },
    })

    return true
  }

  async getTrends({
    skip,
    limit,
    authUser,
  }: {
    authUser: AuthUser
    skip: number
    limit: number
  }): Promise<PaginatedTrends> {
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
        author: {
          isActive: true,
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

    const scoredTags = tags
      .map(({ feedEvents, feedCursors, _count, ...tag }) => {
        const cursor = feedCursors.length > 0 ? feedCursors[0] : null

        const alreadySeen = cursor && feedEvents[0].createdAt <= new Date(cursor.cursor)

        if (alreadySeen) return null

        const score = Math.round(
          feedEvents.reduce<number>(
            (currentScore, event) => currentScore + getEventScore(event, authUser, cursor ? cursor.cursor : null),
            0
          )
        )

        return {
          tag: {
            postCount: _count.posts,
            ...tag,
          },
          score,
          nextCursor: feedEvents[0].createdAt.toISOString(),
        }
      })
      .filter(isNotNull)

    const sortedTagScores = orderBy(scoredTags, 'score', 'desc').slice(skip, limit)

    const items = sortedTagScores.map(({ tag, score, nextCursor }) => {
      return {
        ...tag,
        score,
        nextCursor,
      }
    })

    const nextSkip = skip + limit

    return { items, nextSkip }
  }

  async getTrend({
    tagId,
    authUser,
    skip,
    limit,
  }: {
    tagId: string
    authUser: AuthUser
    skip: number
    limit: number
  }): Promise<Trend> {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
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
        posts: {
          skip,
          take: limit,
          where: {
            feedEvents: {
              some: {
                createdAt: {
                  gt: sub(new Date(), { days: 1 }),
                },
              },
            },
            author: {
              isActive: true,
            },
          },
          select: {
            ...PostSelectWithParent,
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
        },
      },
    })

    if (!tag) throw new Error('No tag')

    const userCursor = tag.feedCursors.length > 0 ? tag.feedCursors[0].cursor : null

    const scoredPosts = tag?.posts
      .map(({ feedEvents, ...post }) => ({
        ...mapPost(post),
        score: feedEvents.reduce<number>(
          (currentScore, feedEvent) => Math.round(currentScore + getEventScore(feedEvent, authUser, userCursor)),
          0
        ),
      }))
      .filter(({ score }) => score > 0)

    const sortedPosts = orderBy(scoredPosts, 'score', 'desc')

    const postIds = tagsWithPostIds.map(({ postIds }) => postIds).flat()

    const allPosts = await this.prismaService.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
    })

    const nextSkip = skip + limit

    return {
      ...tag,
      postCount: tag._count.posts,
      posts: {
        items: sortedPosts,
        nextSkip,
      },
      nextCursor: tag.posts
        .map(({ feedEvents }) => feedEvents)
        .flat()
        .find(({ createdAt }) => createdAt)
        ?.createdAt.toISOString(),
    }
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
