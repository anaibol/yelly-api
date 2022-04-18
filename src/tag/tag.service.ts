import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { PaginatedTrends } from './paginated-trends.model'
import { AuthUser } from 'src/auth/auth.service'
import { Tag } from './tag.model'
import { tagSelect } from './tag-select.constant'
import { excludedTags } from './excluded-tags.constant'

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

  async getLiveTags(authUser: AuthUser): Promise<Tag[]> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const liveTags = await this.prismaService.tag.findMany({
      where: {
        isLive: true,
        countryId: country.id,
      },
      select: tagSelect,
    })

    return liveTags.map(({ _count, ...tag }) => ({
      ...tag,
      postCount: _count.posts,
    }))
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

  async findByText(tagArgs: TagArgs) {
    return this.prismaService.tag.findUnique({
      where: {
        text: tagArgs.text,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        isLive: true,
        isEmoji: true,
      },
    })
  }

  async delete(id: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
    return true
  }

  async getTrends(authUser: AuthUser, isEmoji: boolean, skip: number, limit: number): Promise<PaginatedTrends> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) return Promise.reject(new Error('No country'))

    const [totalCount, tags] = await this.prismaService.$transaction([
      this.prismaService.tag.count({
        where: {
          isLive: false,
          countryId: country.id,
          text: {
            notIn: excludedTags,
            mode: 'insensitive',
          },
        },
      }),
      this.prismaService.tag.findMany({
        where: {
          isLive: false,
          countryId: country.id,
          isEmoji,
          text: {
            notIn: excludedTags,
            mode: 'insensitive',
          },
        },
        skip,
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
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
