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
import { User } from 'src/user/user.model'
import { SortBy, SortDirection } from './tags.args'

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
        text: tagText,
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

  async createOrUpdateLiveTag(text: string, isLive: boolean, authUser: AuthUser): Promise<Tag> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    // Get tag from text
    const tag = await this.prismaService.tag.findUnique({
      where: {
        text,
      },
    })

    const newTag = tag
      ? // If tag exists update isLive
        await this.prismaService.tag.update({
          where: {
            id: tag.id,
          },
          data: {
            isLive,
            countryId: authUserCountry?.id,
          },
        })
      : // Else create it with isLive: true
        await this.prismaService.tag.create({
          data: {
            text,
            isLive,
            countryId: authUserCountry?.id,
          },
        })

    // Delete all tags without posts and isLive: false
    await this.prismaService.tag.deleteMany({
      where: {
        isLive: false,
        posts: {
          every: {
            id: {
              in: [],
            },
          },
        },
      },
    })

    if (isLive) this.pushNotificationService.newLiveTag(newTag.id)

    return newTag
  }

  async getTagAuthor(tagId: string): Promise<User | null> {
    const posts = await this.prismaService.tag
      .findUnique({
        where: {
          id: tagId,
        },
      })
      .posts({
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pictureId: true,
              birthdate: true,
            },
          },
        },
      })

    if (!posts.length) return null

    return posts[0].author
  }

  async getTag(text: string): Promise<Tag> {
    const result = await this.prismaService.tag.findUnique({
      where: {
        text,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        isLive: true,
        isEmoji: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!result) return Promise.reject(new Error('No tag'))

    const { _count, ...tag } = result

    return { ...tag, postCount: _count.posts }
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
    sortBy?: SortBy,
    sortDirection?: SortDirection
  ): Promise<PaginatedTags> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const where: Prisma.TagWhereInput = {
      isLive: false,
      countryId: country.id,
      ...(isEmoji !== undefined && {
        isEmoji,
      }),
      isHidden: false,
    }

    const orderBy =
      sortBy === 'postCount'
        ? {
            posts: {
              _count: sortDirection,
            },
          }
        : {
            createdAt: sortDirection,
          }

    const [totalCount, tags] = await Promise.all([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        skip,
        orderBy,
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
}
