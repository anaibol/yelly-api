import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { TagArgs } from './tag.args'
import { TagIndexAlgoliaInterface } from '../post/tag-index-algolia.interface'

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService, private algoliaService: AlgoliaService) {}
  async syncTagIndexWithAlgolia(tagText: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findUnique({
      select: {
        id: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            pictureId: true,
            firstName: true,
            lastName: true,
          },
        },

        posts: {
          select: {
            author: {
              select: {
                id: true,
                pictureId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          take: 5,
          distinct: 'authorId',
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
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
      createdAtTimestamp: Date.parse(tag.createdAt.toString()),
      // updatedAtTimestamp: Date.parse(post.createdAt.toString()),
      createdAt: tag.createdAt,
      // updatedAt: post.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tagText)
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
    const tag = await this.prismaService.tag.delete({
      where: {
        id,
      },
      select: {
        text: true,
      },
    })

    if (!tag) return false

    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')
    this.algoliaService.deleteObject(algoliaTagIndex, tag.text)
    return true
  }
}
