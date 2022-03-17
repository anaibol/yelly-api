import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { algoliaTagSelect } from '../utils/algolia'
import { UserService } from '../user/user.service'
import { PaginatedTrends } from './paginated-trends.model'
import { AuthUser } from 'src/auth/auth.service'
import { Tag } from './tag.model'

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

  async getLiveTags(authUser: AuthUser): Promise<Tag[]> {
    if (!authUser.schoolId) throw new Error('No school')

    const country = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!country) throw new Error('No country')

    const liveTags = await this.prismaService.tag.findMany({
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
        createdAt: true,
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

    return liveTags.map(({ posts, ...tag }) => ({
      ...tag,
      lastUsers: posts.map((post) => post.author),
      postCount: tag._count.posts,
    }))
  }

  deleteEmptyNonLiveTags() {
    // Delete all tags without posts and isLive: false
    return this.prismaService.tag.deleteMany({
      where: {
        isLive: false,
        posts: {
          none: {},
        },
      },
    })
  }

  async createOrUpdateLiveTag(text: string, isLive: boolean, authorId: string): Promise<Tag> {
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
            authorId,
          },
        })
      : // Else create it with isLive: true
        await this.prismaService.tag.create({
          data: {
            text,
            isLive,
            authorId,
          },
        })

    await this.deleteEmptyNonLiveTags()

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
