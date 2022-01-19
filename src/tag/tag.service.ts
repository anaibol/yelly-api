import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'
import { PushNotificationService } from '../core/push-notification.service'
import { algoliaTagSelect } from '../utils/algolia'

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
      select: algoliaTagSelect,
      where: {
        text: tagText,
      },
    })

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

  async getLiveTag() {
    const liveTag = await this.prismaService.tag.findFirst({
      where: {
        isLive: true,
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

    return {
      ...liveTag,
      ...lastUsers,
      postCount: liveTag._count.posts,
    }
  }

  async createLiveTag(text: string, authUserId: string) {
    await this.prismaService.tag.updateMany({
      where: {
        isLive: true,
      },
      data: {
        isLive: false,
      },
    })

    const newTag = await this.prismaService.tag.upsert({
      where: {
        text,
      },
      create: {
        text,
        isLive: true,
        author: {
          connect: {
            id: authUserId,
          },
        },
      },
      update: {
        isLive: true,
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

    this.pushNotificationService.newLiveTag()

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
}
