import { Injectable } from '@nestjs/common'
import { ActivityType, NotificationType, Prisma, TagType } from '@prisma/client'
import { orderBy, uniqBy } from 'lodash'
import { customAlphabet } from 'nanoid'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AlgoliaService } from '../core/algolia.service'
import { BodyguardService } from '../core/bodyguard.service'
import { PrismaService } from '../core/prisma.service'
import { PushNotificationService } from '../core/push-notification.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { User } from '../user/user.model'
import { UserService } from '../user/user.service'
import { CreateAnonymousTagReactionInput, CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { Tag } from './tag.model'
import { TagReaction } from './tag-reaction.model'
import { tagSelect } from './tag-select.constant'
import { TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

const createNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)

const getTagsSort = (
  sortBy?: TagSortBy,
  sortDirection?: SortDirection
): Prisma.Enumerable<Prisma.TagOrderByWithRelationInput> => {
  switch (sortBy) {
    case 'postCount':
      return [
        {
          posts: {
            _count: sortDirection,
          },
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    case 'reactionsCount':
      return [
        {
          reactions: {
            _count: sortDirection,
          },
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    case 'score':
      return [
        {
          score: sortDirection,
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    case 'rank':
      return [
        {
          rank: sortDirection,
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    default:
      return {
        createdAt: sortDirection,
      }
  }
}

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
    private pushNotificationService: PushNotificationService,
    private bodyguardService: BodyguardService,
    private userService: UserService
  ) {}
  async syncTagIndexWithAlgolia(tagId: bigint) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: tagSelect,
      where: {
        id: tagId,
      },
    })

    if (!tag) return Promise.reject(new Error('Tag not found'))

    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tag.text,
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      reactionsCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: tag.createdAt.getTime(),
      createdAt: tag.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id.toString())
  }

  async getTag(tagId: bigint, authUser: AuthUser): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: authUser.isAdmin ? tagSelect : { ...tagSelect, scoreFactor: false },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts, reactionsCount: _count.reactions }
  }

  async getTagByNanoId(nanoId: string, authUser: AuthUser): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        nanoId,
      },
      select: authUser.isAdmin ? tagSelect : { ...tagSelect, scoreFactor: false },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts, reactionsCount: _count.reactions }
  }

  async create(tagText: string, authUser: AuthUser, tagType: TagType | undefined): Promise<Tag> {
    const expiresAt = new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000)

    const tag = await this.prismaService.tag.create({
      data: {
        nanoId: createNanoId(),
        text: tagText,
        type: tagType,
        countryId: authUser.countryId,
        authorId: authUser.id,
        expiresAt,
        activities: {
          create: {
            userId: authUser.id,
            type: ActivityType.CREATED_TAG,
          },
        },
      },
    })

    this.bodyguardService.analyseTopic(tag, authUser)

    this.syncTagIndexWithAlgolia(tag.id)

    return tag
  }

  async delete(tagId: bigint): Promise<boolean> {
    await this.prismaService.tag.delete({
      where: { id: tagId },
    })

    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, tagId.toString())

    return true
  }

  async getTags(
    authUser: User | AuthUser,
    shouldIncludeExpired: boolean,
    isForYou: boolean,
    showScoreFactor: boolean,
    limit: number,
    after?: bigint,
    sortBy?: TagSortBy,
    sortDirection?: SortDirection,
    showHidden?: boolean,
    authorId?: string
  ) {
    const isAuthUserType = (authUser as AuthUser).isAdmin !== undefined
    const isAdmin = isAuthUserType && (authUser as AuthUser).isAdmin

    if (showHidden && !isAdmin) {
      return Promise.reject(new Error('No admin'))
    }

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const fifteenYoYear = 2007
    const isLessThanFifteen = authUser.birthdate.getFullYear() >= fifteenYoYear

    const where: Prisma.TagWhereInput = {
      ...(authorId
        ? {
            authorId,
          }
        : null),
      ...(shouldIncludeExpired
        ? null
        : {
            expiresAt: {
              gt: new Date(Date.now()),
            },
          }),
      countryId: authUser.countryId,
      ...(!showHidden && {
        isHidden: false,
      }),
      author: {
        isBanned: false,
        blockedUsers: {
          none: {
            id: authUser.id,
          },
        },
        blockedByUsers: {
          none: {
            id: authUser.id,
          },
        },
        ...(isForYou && {
          id: {
            not: authUser.id,
          },
        }),
        ...(isForYou && {
          followers: {
            some: {
              userId: authUser.id,
            },
          },
        }),
      },
    }

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        ...(after && {
          cursor: {
            id: after,
          },
          skip: 1,
        }),
        orderBy: getTagsSort(sortBy, sortDirection),
        take: limit,
        select: showScoreFactor ? tagSelect : { ...tagSelect, score: false, scoreFactor: false },
      }),
    ])

    // Performance optimization to not do rank computation in the tag.rank resolver
    // for today tags
    const isPerformanceOptimization = authorId === undefined && !shouldIncludeExpired

    const items = tags.map((tag) => {
      return {
        ...tag,
        rank: isPerformanceOptimization && tag.rank === 0 ? undefined : tag.rank,
        postCount: tag._count.posts,
        reactionsCount: tag._count.reactions,
      }
    })

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }

  async getTodayTagRank(user: AuthUser | User, tagId: bigint): Promise<number> {
    const { items } = await this.getTagsByRank(user, false, false, 1000, 0)

    const index = items.findIndex(({ id }) => id === tagId)

    return index < 0 ? 0 : index + 1
  }

  async getTagsByRank(
    authUser: User | AuthUser,
    shouldIncludeExpired: boolean,
    isForYou: boolean,
    limit: number,
    skip: number
  ) {
    // We need the score factor to compute the ranking
    const showScoreFactor = true
    const isAuthUserType = (authUser as AuthUser).isAdmin !== undefined
    const isAdmin = isAuthUserType && (authUser as AuthUser).isAdmin

    const { items, totalCount } = await this.getTags(
      authUser,
      shouldIncludeExpired,
      isForYou,
      showScoreFactor,
      1000,
      undefined,
      shouldIncludeExpired ? TagSortBy.rank : TagSortBy.score,
      shouldIncludeExpired ? SortDirection.asc : SortDirection.desc
    )

    // Today rank is computed at runtime
    if (!shouldIncludeExpired) {
      // Get tags with at least 10 interactions ordered by engagment score
      const selectedTags = orderBy(
        items.filter((tag) => tag.interactionsCount >= 10),
        'score',
        'desc'
      )

      // eslint-disable-next-line functional/immutable-data
      selectedTags.push(...items)

      const tags = uniqBy(selectedTags, 'id')
        .slice(skip, skip + limit)
        .map((tag, index) => ({
          ...tag,
          rank: skip + index + 1,
          // Display score for admin only
          score: isAdmin ? tag?.score : undefined,
          scoreFactor: isAdmin ? tag.scoreFactor : undefined,
        }))

      const nextSkip = skip + limit

      return { items: tags, nextSkip: totalCount > nextSkip ? nextSkip : null, totalCount }
    }

    const tags = items.slice(skip, skip + limit).map((tag) => ({
      ...tag,
      // Display score for admin only
      score: isAdmin ? tag?.score : undefined,
      scoreFactor: isAdmin ? tag.scoreFactor : undefined,
    }))

    const nextSkip = skip + limit

    return { items: tags, nextSkip: totalCount > nextSkip ? nextSkip : null, totalCount }
  }

  async updateTag(tagId: bigint, { isHidden, scoreFactor }: UpdateTagInput): Promise<Tag> {
    return this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        isHidden,
        scoreFactor,
      },
    })
  }

  async createPromotedTag(tagText: string, _authUser: AuthUser): Promise<Tag> {
    const tag = await this.prismaService.tag.findFirst({
      where: {
        text: tagText,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    //this.pushNotificationService.promotedTag(tag)

    return tag
  }

  getAuthUserReaction(tagId: bigint, authUser: AuthUser): Promise<TagReaction | null> {
    return this.prismaService.tagReaction.findFirst({
      where: {
        authorId: authUser.id,
        tagId,
      },
    })
  }

  async createOrUpdateTagReaction(
    createOrUpdateTagReactionInput: CreateOrUpdateTagReactionInput,
    authUser: AuthUser
  ): Promise<TagReaction> {
    const { text, tagId } = createOrUpdateTagReactionInput

    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    const tagReaction = await this.prismaService.tagReaction.findFirst({
      where: {
        tagId,
        authorId: authUser.id,
      },
    })

    if (tagReaction) return Promise.reject(new Error('Already reacted'))

    const reaction = await this.prismaService.tagReaction.create({
      data: {
        authorId: authUser.id,
        text,
        tagId,
        activity: {
          create: {
            userId: authUser.id,
            tagId,
            type: ActivityType.CREATED_TAG_REACTION,
          },
        },
        ...(tag.authorId && {
          notification: {
            create: {
              type: NotificationType.REACTED_TO_YOUR_TAG,
              userId: tag.authorId,
            },
          },
        }),
      },
    })

    this.updateInteractionsCount(tag.id)
    if (tag.authorId && tag.authorId !== authUser.id) {
      this.userService.follow(authUser.id, tag.authorId)
    }

    // if (!tag.hasBeenTrending) this.checkIfTagIsTrendingTrending(reaction.tagId)

    this.pushNotificationService.reactedToYourTag(reaction.id)

    return reaction
  }

  async createAnonymousTagReaction(createAnonymousTagReactionInput: CreateAnonymousTagReactionInput): Promise<boolean> {
    const { tagNanoId } = createAnonymousTagReactionInput

    const tag = await this.prismaService.tag.findUnique({
      where: {
        nanoId: tagNanoId,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    const reaction = await this.prismaService.tagReaction.create({
      data: {
        text: '',
        tag: {
          connect: {
            nanoId: tagNanoId,
          },
        },
        ...(tag.authorId && {
          notification: {
            create: {
              type: NotificationType.REACTED_TO_YOUR_TAG,
              userId: tag.authorId,
            },
          },
        }),
      },
    })

    this.updateInteractionsCount(tag.id)

    // if (!tag.hasBeenTrending) this.checkIfTagIsTrendingTrending(reaction.tagId)

    this.pushNotificationService.reactedToYourTag(reaction.id)

    return true
  }

  async checkIfTagIsTrendingTrending(tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: {
        id: true,
        author: true,
      },
    })

    if (!tag?.author?.countryId) return Promise.reject(new Error('No country'))

    const topTags = await this.getTags(
      {
        ...tag.author,
        isAdmin: false,
        isNotAdmin: true,
      },
      false,
      false,
      false,
      5,
      undefined,
      TagSortBy.reactionsCount,
      SortDirection.desc
    )

    if (topTags.items.some(({ id }) => id === tag.id)) {
      await this.prismaService.notification.create({
        data: {
          userId: tag.author.id,
          type: NotificationType.YOUR_TAG_IS_TRENDING,
          tagId: tag.id,
        },
      })

      await this.prismaService.tag.update({
        where: { id: tag.id },
        data: { hasBeenTrending: true },
      })

      this.pushNotificationService.yourTagIsTrending(tag.id)
    }
  }

  async deleteTagReaction(tagId: bigint, authUser: AuthUser): Promise<boolean> {
    await this.prismaService.tagReaction.deleteMany({
      where: { authorId: authUser.id, tagId },
    })

    this.updateInteractionsCount(tagId, false)

    return true
  }

  async trackTagViews(tagsIds: bigint[]): Promise<boolean> {
    const tags = await this.prismaService.tag.findMany({
      where: {
        id: { in: tagsIds },
      },
      select: {
        id: true,
        viewsCount: true,
        interactionsCount: true,
        scoreFactor: true,
      },
    })

    const promises: Promise<any>[] = []

    tags.forEach((tag) =>
      // eslint-disable-next-line functional/immutable-data
      promises.push(
        this.prismaService.tag.update({
          where: { id: tag.id },
          data: {
            viewsCount: { increment: 1 },
            score: this.getTagScore({ ...tag, viewsCount: tag.viewsCount + 1 }),
          },
        })
      )
    )

    await Promise.all(promises)

    return true
  }

  async updateInteractionsCount(tagId: bigint, isIncrement = true): Promise<boolean> {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: {
        viewsCount: true,
        interactionsCount: true,
        scoreFactor: true,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    // TODO: Use a single transaction for both read and update counters
    await this.prismaService.tag.update({
      where: { id: tagId },
      data: {
        interactionsCount: isIncrement ? { increment: 1 } : { decrement: 1 },
        score: this.getTagScore({ ...tag, interactionsCount: tag.interactionsCount + (isIncrement ? 1 : -1) }),
      },
    })

    return true
  }

  getTagScore({
    viewsCount,
    interactionsCount,
    scoreFactor,
  }: {
    viewsCount?: number
    interactionsCount: number
    scoreFactor: number | null
  }) {
    if (!viewsCount || viewsCount === 0 || !interactionsCount || interactionsCount === 0) return 0
    return (interactionsCount / viewsCount) * (scoreFactor ?? 1)
  }
}
