import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { algoliaTagSelect } from '../utils/algolia'
import { UserService } from '../user/user.service'
import { DEFAULT_LIMIT } from 'src/common/pagination.constant'
import { PaginatedTrends } from './paginated-trends.model'
import { Tag } from './tag.model'
import { LiveTagAuthUser } from 'src/post/live-tag-auth-user.model'

@Injectable()
export class TagService {
  constructor(
    private prismaService: PrismaService,
    private algoliaService: AlgoliaService,
    private pushNotificationService: PushNotificationService,
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
      // updatedAtTimestamp: tag.updatedAt.getTime(),
      createdAt: tag.createdAt,
      // updatedAt: post.updatedAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tag.id)
  }

  async getAuthUserLiveTag(authUserId: string, authUserCountryId: string): Promise<LiveTagAuthUser | null> {
    const liveTag = await this.prismaService.tag.findFirst({
      where: {
        isLive: true,
        author: {
          school: {
            city: {
              countryId: authUserCountryId,
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

    const authUserPosted = await this.userService.hasUserPostedOnTag(authUserId, liveTag.text)

    return {
      ...liveTag,
      ...lastUsers,
      authUserPosted,
      postCount: liveTag._count.posts,
    }
  }

  async createLiveTag(text: string, authorId: string, countryId: string) {
    // await this.prismaService.tag.updateMany({
    //   where: {
    //     isLive: true,
    //     author: {
    //       school: {
    //         city: {
    //           countryId,
    //         },
    //       },
    //     },
    //   },
    //   data: {
    //     isLive: false,
    //   },
    // })

    const previousTag = await this.prismaService.tag.findFirst({
      where: {
        text,
        author: {
          school: {
            city: {
              countryId,
            },
          },
        },
      },
    })

    const newTag = previousTag
      ? await this.prismaService.tag.update({
          where: {
            text,
          },
          data: {
            isLive: true,
            author: {
              connect: {
                id: authorId,
              },
            },
          },
        })
      : await this.prismaService.tag.create({
          data: {
            text,
            isLive: true,
            author: {
              connect: {
                id: authorId,
              },
            },
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

    await this.pushNotificationService.newLiveTag(countryId)

    return newTag
  }

  async findById(tagArgs: TagArgs) {
    return this.prismaService.tag.findUnique({
      where: {
        id: tagArgs.id,
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

  async getTrends(authUserCountryId: string, skip = 0, limit = DEFAULT_LIMIT): Promise<PaginatedTrends> {
    const tags = await this.prismaService.tag.findMany({
      where: {
        isLive: false,
        ...(authUserCountryId && {
          author: {
            school: {
              city: {
                countryId: authUserCountryId,
              },
            },
          },
        }),
      },
      ...(skip && {
        skip,
      }),
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: limit,
      select: algoliaTagSelect,
    })

    const nextSkip = skip + limit

    const dataTags = tags.map((tag) => {
      return {
        ...tag,
        lastUsers: tag.posts.map((post) => post.author),
        postCount: tag._count.posts,
      }
    })

    return { items: dataTags, nextSkip }
  }
}
