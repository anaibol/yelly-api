import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { AuthUser } from '../auth/auth.service'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { PushNotificationService } from '../core/push-notification.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { PaginatedTags } from './paginated-tags.model'
import { Tag } from './tag.model'
import { TagReaction } from './tag-reaction.model'
import { tagSelect } from './tag-select.constant'
import { SortDirection, TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

const getTagSort = (
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

  async getTagExists(tagText: string): Promise<boolean> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        text_date: {
          text: tagText,
          date: new Date(),
        },
      },
      select: {
        id: true,
      },
    })

    return !!result
  }

  async create(tagText: string, authUser: AuthUser): Promise<Tag> {
    const tag = await this.prismaService.tag.create({
      data: {
        text: tagText,
        countryId: authUser.countryId,
        authorId: authUser.id,
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
    date: string = new Date().toISOString().split('T')[0], // YYYY-MM-DD
    skip: number,
    limit: number,
    sortBy?: TagSortBy,
    sortDirection?: SortDirection,
    showHidden?: boolean
  ): Promise<PaginatedTags> {
    if (showHidden && !authUser?.isAdmin) return Promise.reject(new Error('No admin'))

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const minYear = 2007
    const maxYear = 2009

    const isBetween13And15 = authUser.birthdate.getFullYear() >= minYear && authUser.birthdate.getFullYear() <= maxYear

    const where: Prisma.TagWhereInput = {
      date: new Date(date),
      countryId: authUser.countryId,
      ...(!showHidden && {
        isHidden: false,
      }),
      author: {
        birthdate: isBetween13And15
          ? {
              gte: new Date(minYear + '-01-01'),
              lte: new Date(maxYear + '-01-12'),
            }
          : {
              gte: new Date(maxYear + 1 + '-01-01'),
            },
      },
    }

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        skip,
        orderBy: getTagSort(sortBy, sortDirection),
        take: limit,
        select: tagSelect,
      }),
    ])

    const nextSkip = skip + limit

    const items = tags.map((tag) => {
      return {
        ...tag,
        postCount: tag._count.posts,
        reactionsCount: tag._count.reactions,
      }
    })

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
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

    const tag = await this.prismaService.tag.findUnique({
      where: {
        text_date: {
          text: tagText,
          date: new Date(),
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

    const { tag, ...reaction } = await this.prismaService.tagReaction.upsert({
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
      },
      update: {
        text,
        authorId,
        tagId,
      },
      include: {
        tag: {
          select: tagSelect,
        },
      },
    })

    if (tag?.author?.id !== authUser.id) this.pushNotificationService.newTagReaction(reaction)

    return {
      ...reaction,
      // tag: mapPost(tag),
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
