import { Injectable } from '@nestjs/common'
import { ActivityType, NotificationType, Prisma } from '@prisma/client'
import { customAlphabet } from 'nanoid'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { PushNotificationService } from '../core/push-notification.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { getLastResetDate, getPreviousResetDate } from '../utils/dates'
import { CreateAnonymousTagReactionInput, CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { Tag } from './tag.model'
import { TagReaction } from './tag-reaction.model'
import { tagSelect } from './tag-select.constant'
import { TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'
const createNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

const getTagsSort = (
  sortBy?: TagSortBy,
  sortDirection?: SortDirection
): Prisma.Enumerable<Prisma.TagOrderByWithRelationInput> => {
  switch (sortBy) {
    case 'postCount':
      return {
        posts: {
          _count: sortDirection,
        },
      }

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

  async getTag(tagId: bigint): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: tagSelect,
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
      select: tagSelect,
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

  async create(tagText: string, authUser: AuthUser): Promise<Tag> {
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
    authUser: AuthUser,
    isYesterday: boolean,
    limit: number,
    after?: bigint,
    sortBy?: TagSortBy,
    sortDirection?: SortDirection,
    showHidden?: boolean,
    authorId?: string
  ) {
    if (showHidden && !authUser?.isAdmin) return Promise.reject(new Error('No admin'))

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

  async updateTag(tagId: bigint, { isHidden }: UpdateTagInput): Promise<Tag> {
    return this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        isHidden,
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
    return this.prismaService.tagReaction.findUnique({
      where: {
        authorId_tagId: {
          authorId: authUser.id,
          tagId,
        },
      },
    })
  }

  async createOrUpdateTagReaction(
    createOrUpdateTagReactionInput: CreateOrUpdateTagReactionInput,
    authUser: AuthUser
  ): Promise<TagReaction> {
    const { text, tagId } = createOrUpdateTagReactionInput
    const authorId = authUser.id

    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    })

    if (!tag) return Promise.reject(new Error('No tag'))

    const reaction = await this.prismaService.tagReaction.upsert({
      where: {
        authorId_tagId: {
          authorId,
          tagId,
        },
      },
      create: {
        author: {
          connect: {
            id: authUser.id,
          },
        },
        text,
        tag: {
          connect: {
            id: tagId,
          },
        },
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
      update: {
        text,
        authorId,
        tagId,
      },
    })

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
        author: {
          connect: {
            id: 'ANONYMOUS',
          },
        },
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
    await this.prismaService.tagReaction.delete({
      where: {
        authorId_tagId: { authorId: authUser.id, tagId },
      },
    })

    return true
  }

  async trackTagViews(tagsIds: bigint[]): Promise<boolean> {
    await this.prismaService.tag.updateMany({
      where: { id: { in: tagsIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }
}
