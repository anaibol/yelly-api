import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { algoliaTagSelect } from '../utils/algolia'
import { UserService } from '../user/user.service'
import { DEFAULT_LIMIT } from 'src/common/pagination.constant'
import { PaginatedTrends } from './paginated-trends.model'
import { LiveTagAuthUser } from 'src/post/live-tag-auth-user.model'
import { AuthUser } from 'src/auth/auth.service'

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
    private pushNotificationService: PushNotificationService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) {}
  async syncTagIndexWithAlgolia(tagText: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: algoliaTagSelect,
      where: {
        text: tagText,
      },
    })

    if (!tag) throw new Error('Tag not found')

    const lastUsers = tag.posts.map((post) => post.author)

    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tagText,
      lastUsers: [...lastUsers],
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: tag.createdAt.getTime(),
      createdAt: tag.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id)
  }

  async getAuthUserLiveTag(authUser: AuthUser): Promise<LiveTagAuthUser | null> {
    const country = await this.prismaService.user
      .findUnique({
        where: { id: authUser.id },
      })
      .school()
      .city()
      .country()

    if (!country) throw new Error('No country')

    const liveTag = await this.prismaService.tag.findFirst({
      where: {
        isLive: true,
        author: {
          school: {
            city: {
              countryId: country.id,
            },
          },
        },
      },
      select: {
        id: true,
        text: true,
        posts: {
          select: {
            createdAt: true,
            author: {
              select: {
                id: true,
                pictureId: true,
                firstName: true,
              },
            },
          },
          take: 5,
          distinct: 'authorId',
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!liveTag) return null

    const lastUsers = liveTag.posts.map((post) => post.author)

    const authUserPosted = await this.userService.hasUserPostedOnTag(authUser.id, liveTag.id)

    return {
      ...liveTag,
      ...lastUsers,
      authUserPosted,
      postCount: liveTag._count.posts,
    }
  }

  async createLiveTag(text: string, authorId: string) {
    const country = await this.prismaService.user
      .findUnique({
        where: { id: authorId },
      })
      .school()
      .city()
      .country()

    if (!country) throw new Error('No country')

    await this.prismaService.tag.updateMany({
      where: {
        isLive: true,
        author: {
          school: {
            city: {
              countryId: country.id,
            },
          },
        },
      },
      data: {
        isLive: false,
      },
    })

    const previousTag = await this.prismaService.tag.findFirst({
      where: {
        text,
      },
    })

    const newTag = previousTag
      ? await this.prismaService.tag.update({
          where: {
            id: previousTag.id,
          },
          data: {
            isLive: true,
            authorId,
          },
        })
      : await this.prismaService.tag.create({
          data: {
            text,
            isLive: true,
            authorId,
          },
        })

    await this.prismaService.tag.deleteMany({
      where: {
        isLive: false,
        posts: {
          none: {},
        },
      },
    })

    this.pushNotificationService.newLiveTag(country.id)

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
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  async deleteById(id: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
    return true
  }

  async getTrends(authUser: AuthUser, skip: number, limit: number): Promise<PaginatedTrends> {
    const country = await this.prismaService.user
      .findUnique({
        where: { id: authUser.id },
      })
      .school()
      .city()
      .country()

    if (!country) throw new Error('No country')

    const where = {
      isLive: false,
      author: {
        school: {
          city: {
            countryId: country.id,
          },
        },
      },
    }

    const [totalCount, tags] = await this.prismaService.$transaction([
      this.prismaService.tag.count({
        where,
      }),
      this.prismaService.tag.findMany({
        where,
        skip,
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        take: limit,
        select: algoliaTagSelect,
      }),
    ])

    const nextSkip = skip + limit

    const dataTags = tags.map((tag) => {
      return {
        ...tag,
        lastUsers: tag.posts.map((post) => post.author),
        postCount: tag._count.posts,
      }
    })

    return { items: dataTags, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }
}
