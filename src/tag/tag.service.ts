import { Injectable } from '@nestjs/common'
import { ActivityType, NotificationType, Prisma, TagType } from '@prisma/client'
import { orderBy, uniqBy } from 'lodash'
import { customAlphabet } from 'nanoid'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { PushNotificationService } from '../core/push-notification.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { User } from '../user/user.model'
import {
  getLastResetDate,
  getLastResetDateFromDate,
  getPreviousResetDate,
  getPreviousResetDateFromDate,
} from '../utils/dates'
import { CreateAnonymousTagReactionInput, CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { Tag } from './tag.model'
import { TagReaction } from './tag-reaction.model'
import { tagSelect } from './tag-select.constant'
import { TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'
const createNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

const countryFrId = 'e4eee8e7-2770-4fb0-97bb-4839b06ff37b'

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
    private pushNotificationService: PushNotificationService
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

  // async createOrUpdateLiveTag(text: string, isLive: boolean, authUser: AuthUser): Promise<Tag> {
  //   if (!authUser.schoolId) return Promise.reject(new Error('No school'))

  //   const authUserCountry = await this.prismaService.school
  //     .findUnique({
  //       where: { id: authUser.schoolId },
  //     })
  //     .city()
  //     .country()

  //   // Get tag from text
  //   const tag = await this.prismaService.tag.findUnique({
  //     where: {
  //       text,
  //     },
  //   })

  //   const newTag = tag
  //     ? // If tag exists update isLive
  //       await this.prismaService.tag.update({
  //         where: {
  //           id: tag.id,
  //         },
  //         data: {
  //           isLive,
  //           countryId: authUserCountry?.id,
  //         },
  //       })
  //     : // Else create it with isLive: true
  //       await this.prismaService.tag.create({
  //         data: {
  //           text,
  //           isLive,
  //           countryId: authUserCountry?.id,
  //         },
  //       })

  //   // Delete all tags without posts and isLive: false
  //   await this.prismaService.tag.deleteMany({
  //     where: {
  //       isLive: false,
  //       posts: {
  //         every: {
  //           id: {
  //             in: [],
  //           },
  //         },
  //       },
  //     },
  //   })

  //   if (isLive) this.pushNotificationService.newLiveTag(newTag.id)

  //   return newTag
  // }

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

  async getTagByNanoId(nanoId: string): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        nanoId,
      },
      select: { ...tagSelect, scoreFactor: false },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts, reactionsCount: _count.reactions }
  }

  async getTagExists(tagText: string): Promise<boolean> {
    const result = await this.prismaService.tag.findFirst({
      where: {
        text: tagText,
        createdAt: {
          gte: getLastResetDate(),
        },
      },
      select: {
        id: true,
      },
    })

    return !!result
  }

  async create(tagText: string, authUser: AuthUser, tagType: TagType | undefined): Promise<Tag> {
    const tagCreated = await this.prismaService.tag.findFirst({
      where: {
        authorId: authUser.id,
        createdAt: {
          gte: getLastResetDate(),
        },
      },
      select: {
        id: true,
      },
    })

    if (tagCreated && !authUser.isAdmin) return Promise.reject(new Error('Already created a tag'))

    const tagAlreadyExists = await this.prismaService.tag.findFirst({
      where: {
        createdAt: {
          gte: getLastResetDate(),
        },
        text: tagText,
      },
      select: {
        id: true,
      },
    })

    if (tagAlreadyExists && !authUser.isAdmin) return Promise.reject(new Error('Already already exists'))

    const tag = await this.prismaService.tag.create({
      data: {
        nanoId: createNanoId(),
        text: tagText,
        type: tagType,
        countryId: authUser.countryId,
        authorId: authUser.id,
        activities: {
          create: {
            userId: authUser.id,
            type: ActivityType.CREATED_TAG,
          },
        },
      },
    })

    this.syncTagIndexWithAlgolia(tag.id)

    this.pushNotificationService.followeeCreatedTag(tag.id)

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
    isYesterday: boolean,
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

    if (showHidden && isAdmin) return Promise.reject(new Error('No admin'))

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const fifteenYoYear = 2007
    const isLessThanFifteen = authUser.birthdate.getFullYear() >= fifteenYoYear

    const where: Prisma.TagWhereInput = {
      ...(authorId
        ? {
            authorId,
          }
        : {
            createdAt: isYesterday
              ? {
                  gte: getPreviousResetDate(),
                  lt: getLastResetDate(),
                }
              : {
                  gte: getLastResetDate(),
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
        birthdate: isLessThanFifteen
          ? {
              gte: new Date(fifteenYoYear + '-01-01'),
            }
          : {
              lte: new Date(fifteenYoYear + '-01-01'),
            },
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

    const items = tags.map((tag) => {
      return {
        ...tag,
        // Performance optimization to not call tag.rank resolver today rank computation
        rank: isYesterday ? tag.rank : undefined,
        postCount: tag._count.posts,
        reactionsCount: tag._count.reactions,
      }
    })

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }

  async getTodayTagRank(user: AuthUser | User, tagId: bigint): Promise<number> {
    const { items } = await this.getTagsByRank(user, false, 1000, 0)

    const index = items.findIndex(({ id }) => id === tagId)

    return index < 0 ? 0 : index + 1
  }

  async getTagsByRank(authUser: User | AuthUser, isYesterday: boolean, limit: number, skip: number) {
    // We need the score factor to compute the ranking
    const showScoreFactor = true
    const isAuthUserType = (authUser as AuthUser).isAdmin !== undefined
    const isAdmin = isAuthUserType && (authUser as AuthUser).isAdmin

    const { items, totalCount } = await this.getTags(
      authUser,
      isYesterday,
      showScoreFactor,
      1000,
      undefined,
      isYesterday ? TagSortBy.rank : TagSortBy.score,
      isYesterday ? SortDirection.asc : SortDirection.desc
    )

    // Today rank is computed at runtime
    if (!isYesterday) {
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

  getWhereTagsForRanking(date: Date, isLessThanFifteen: boolean): Prisma.TagWhereInput {
    const fifteenYoYear = 2007

    const where: Prisma.TagWhereInput = {
      createdAt: {
        gte: getPreviousResetDateFromDate(date),
        lt: getLastResetDateFromDate(date),
      },
      isHidden: false,
      author: {
        isBanned: false,
        birthdate: isLessThanFifteen
          ? {
              gte: new Date(fifteenYoYear + '-01-01'),
            }
          : {
              lte: new Date(fifteenYoYear + '-01-01'),
            },
      },
    }
    return where
  }

  async getTagsForRanking(date: Date, countryId: string, isLessThanFifteen: boolean, limit: number, after?: bigint) {
    const where: Prisma.TagWhereInput = { ...this.getWhereTagsForRanking(date, isLessThanFifteen), countryId }

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
        orderBy: getTagsSort(TagSortBy.score, SortDirection.desc),
        take: limit,
        select: tagSelect,
      }),
    ])

    const items = tags.map((tag) => {
      return {
        ...tag,
        postCount: tag._count.posts,
        reactionsCount: tag._count.reactions,
      }
    })

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
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
    // if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    // const authUserCountry = await this.prismaService.school
    //   .findUnique({
    //     where: { id: authUser.schoolId },
    //   })
    //   .city()
    //   .country()

    // Get tag from text
    // const tag = await this.prismaService.tag.upsert({
    //   where: {
    //     text: tagText,
    //   },
    //   create: {
    //     text: tagText,
    //     countryId: authUserCountry?.id,
    //   },
    //   update: {},
    // })

    const tag = await this.prismaService.tag.findFirst({
      where: {
        text: tagText,
        createdAt: {
          gte: getLastResetDate(),
        },
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    this.pushNotificationService.promotedTag(tag)

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

    if (!tag.hasBeenTrending) this.checkIfTagIsTrendingTrending(reaction.tagId)

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

    if (!tag.hasBeenTrending) this.checkIfTagIsTrendingTrending(reaction.tagId)

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

  async computeTagRanking(date: Date) {
    // France first 🇫🇷
    console.log('computeTagRanking:France:started')
    await Promise.all([
      this.computeTagRankingCore(date, countryFrId, false),
      this.computeTagRankingCore(date, countryFrId, true),
    ])
    console.log('computeTagRanking:France:completed')

    // All countries
    console.log('computeTagRanking:All countries:started')
    await this.computeTagRankingForAllCountries(date, false)
    await this.computeTagRankingForAllCountries(date, true)
    console.log('computeTagRanking:All completed:completed')
  }

  async computeTagRankingForAllCountries(date: Date, isLessThanFifteen: boolean) {
    // Get the list of countries of tags for the specified date
    // FR excluded
    const where: Prisma.TagWhereInput = { ...this.getWhereTagsForRanking(date, true), countryId: { not: countryFrId } }

    const countries = await this.prismaService.tag.findMany({
      where,
      select: {
        country: {
          select: {
            id: true,
            code: true,
          },
        },
      },
      distinct: ['countryId'],
    })

    console.log(`computeTagRankingForAllCountries:countries`, {
      count: countries.length,
    })

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let index = 0; index < countries.length; index++) {
      const country = countries[index].country
      if (!country) continue
      console.log(`computeTagRankingForAllCountries:${country.code}:started`, { isLessThanFifteen })
      await this.computeTagRankingCore(date, country.id, isLessThanFifteen)
      console.log(`computeTagRankingForAllCountries:${country.code}:completed`, { isLessThanFifteen })
    }
  }

  async computeTagRankingCore(date: Date, countryId: string, isLessThanFifteen: boolean) {
    const { items } = await this.getTagsForRanking(date, countryId, isLessThanFifteen, 1000)

    // Get tags with at least 10 interactions ordered by engagment score
    const selectedTags = orderBy(
      items.filter((tag) => tag.interactionsCount >= 10),
      'score',
      'desc'
    )

    // eslint-disable-next-line functional/immutable-data
    selectedTags.push(...items)

    const tags = uniqBy(selectedTags, 'id')

    // DEBUG
    // console.log('computeTagRankingCore', {
    //   tags: tags.map((tag) => ({ countryId, id: tag.id, text: tag.text, interactionsCount: tag.interactionsCount })),
    // })

    // Update tags rank
    // Use loop to guarantee to wait for all the updates to be completed
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let index = 0; index < tags.length; index++) {
      const rank = index + 1

      // DEBUG
      // console.log('computeTagRankingCore:update', {
      //   countryId,
      //   isLessThanFifteen,
      //   tagId: tags[index].id,
      //   tagText: tags[index].text,
      //   createdAt: tags[index].createdAt,
      //   rank,
      // })

      await this.prismaService.tag.update({
        where: {
          id: tags[index].id,
        },
        data: {
          rank,
        },
      })
    }
    return true
  }
}
