import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { PaginatedTags } from './paginated-tags.model'
import { AuthUser } from 'src/auth/auth.service'
import { Tag } from './tag.model'
import { tagSelect } from './tag-select.constant'
import { Prisma } from '@prisma/client'
import { TagSortBy, SortDirection } from './tags.args'
import { UpdateTagInput } from './update-tag.input'
import { CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { TagReaction } from './tag-reaction.model'

const getSort = (sortBy?: TagSortBy, sortDirection?: SortDirection): Prisma.TagOrderByWithRelationInput => {
  switch (sortBy) {
    case 'postCount':
      return {
        posts: {
          _count: sortDirection,
        },
      }

    case 'reactionsCount':
      return {
        reactions: {
          _count: sortDirection,
        },
      }

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
  async syncTagIndexWithAlgolia(tagText: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: tagSelect,
      where: {
        text_date: {
          text: tagText,
          date: new Date(),
        },
      },
    })

    if (!tag) return Promise.reject(new Error('Tag not found'))

    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tagText,
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: tag.createdAt.getTime(),
      createdAt: tag.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id)
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

  async getTag(tagId: string): Promise<Tag> {
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

  async getTagExists(text: string): Promise<boolean> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        text_date: {
          text,
          date: new Date(),
        },
      },
      select: {
        id: true,
      },
    })

    return !!result
  }

  async delete(id: string): Promise<boolean> {
    await this.prismaService.tag.delete({
      where: { id },
    })

    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)

    return true
  }

  async getTags(
    authUser: AuthUser,
    skip: number,
    limit: number,
    isEmoji?: boolean,
    sortBy?: TagSortBy,
    sortDirection?: SortDirection,
    showHidden?: boolean
  ): Promise<PaginatedTags> {
    if (showHidden && !authUser.isAdmin) return Promise.reject(new Error('No admin'))

    const where: Prisma.TagWhereInput = {
      isLive: false,
      countryId: authUser.countryId,
      ...(isEmoji !== undefined && {
        isEmoji,
      }),
      ...(!showHidden && {
        isHidden: false,
      }),
    }

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        skip,
        orderBy: getSort(sortBy, sortDirection),
        take: limit,
        select: tagSelect,
      }),
    ])

    const nextSkip = skip + limit

    const dataTags = tags.map((tag) => {
      return {
        ...tag,
        postCount: tag._count.posts,
      }
    })

    return { items: dataTags, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  async updateTag(tagId: string, { isHidden }: UpdateTagInput): Promise<Tag> {
    return this.prismaService.tag.update({
      where: {
        id: tagId,
      },
      data: {
        isHidden,
      },
    })
  }

  async createPromotedTag(tagText: string, authUser: AuthUser): Promise<Tag> {
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

  getAuthUserReaction(tagId: string, authUser: AuthUser): Promise<TagReaction | null> {
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

    // await this.prismaService.feedEvent.create({
    //   data: {
    //     tagId,
    //     postReactionId: reaction.id,
    //     type: 'TAG_REACTION_CREATED',
    //     postReactionAuthorBirthdate: authUser.birthdate,
    //     postReactionAuthorSchoolId: authUser.schoolId,
    //   },
    // })

    // if (tag.author.id !== authUser.id) this.pushNotificationService.newPostReaction(reaction)

    return {
      ...reaction,
      // tag: mapPost(tag),
    }
  }

  async deleteTagReaction(tagId: string, authUser: AuthUser): Promise<boolean> {
    const authorId = authUser.id

    await this.prismaService.tagReaction.delete({
      where: {
        authorId_tagId: { authorId, tagId },
      },
    })

    return true
  }
}
