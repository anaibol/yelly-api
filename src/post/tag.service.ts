import { Injectable } from '@nestjs/common'
import { AlgoliaService } from '../core/algolia.service'
import { PrismaService } from '../core/prisma.service'
import { NotFoundLiveTagException } from './not-found-live-tag.exception'
import { TagIndexAlgoliaInterface } from './tag-index-algolia.interface'

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService, private algoliaService: AlgoliaService) {}
  async syncTagIndexWithAlgolia(tagText: string, post) {
    const algoliaTagIndex = await this.algoliaService.initIndex('TAGS')

    const tag = await this.prismaService.tag.findFirst({
      select: {
        id: true,
        createdAt: true,
        posts: {
          select: {
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
      },
      where: {
        text: tagText,
      },
    })
    // INFO: Map data to fit Tag index algolia interface
    const lastUsers = this.mapAuthorBufferIdToUUID(tag.posts)
    const objectToUpdateOrCreate: TagIndexAlgoliaInterface = {
      id: tag.id,
      text: tagText,
      lastUsers: [...lastUsers],
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      createdAtTimestamp: Date.parse(tag.createdAt.toString()),
      updatedAtTimestamp: Date.parse(post.createdAt.toString()),
      createdAt: tag.createdAt,
      updatedAt: post.createdAt,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, tagText)
  }

  async getLiveTag() {
    const liveTag = await this.prismaService.tag.findFirst({
      select: {
        id: true,
        text: true,
      },
      where: {
        isLive: true,
      },
    })

    if (liveTag == null) {
      throw new NotFoundLiveTagException()
    }

    return liveTag
  }

  async createLiveTag(text: string, email: string) {
    await this.prismaService.tag.updateMany({
      where: {
        isLive: true,
      },
      data: {
        isLive: false,
      },
    })

    return this.prismaService.tag.upsert({
      where: {
        text,
      },
      create: {
        text,
        isLive: true,
        author: {
          connect: {
            email,
          },
        },
      },
      update: {
        isLive: true,
      },
    })
  }

  mapAuthorBufferIdToUUID(posts) {
    return posts.map((post) => {
      const authorWithUUID = {
        ...post.author,
      }
      authorWithUUID.id = this.prismaService.mapBufferIdToString(post.author.id)

      return authorWithUUID
    })
  }
}
