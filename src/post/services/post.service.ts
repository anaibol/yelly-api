import { Injectable } from '@nestjs/common'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { PrismaService } from 'src/core/services/prisma.service'
import { CreatePostInput } from '../dto/create-post.input'
import { TagService } from './tag.service'

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService, private tagService: TagService) {}

  // TODO: Add return type, is not q expected result
  async find(tagText = '', userId = '', currentCursor = '', limit = DEFAULT_LIMIT) {
    const cursorDefinition = this.getFindCursorDefinition(currentCursor)

    const posts = await this.prismaService.post.findMany({
      where: {
        ...(tagText.length && {
          tags: {
            every: {
              text: tagText,
            },
          },
        }),
        ...(userId.length && {
          ownerId: this.prismaService.mapStringIdToBuffer(userId),
        }),
      },
      ...cursorDefinition,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthdate: true,
            pictureId: true,
          },
        },
        tags: {
          select: {
            id: true,
            createdAt: true,
            text: true,
            isLive: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
    const mappedPosts = this.mapauthorBufferIdToUUID(posts)
    const cursor = this.getCursor(mappedPosts, limit)

    return { posts: mappedPosts, cursor }
  }

  private getFindCursorDefinition(currentCursor) {
    let cursorDefinition = {}
    if (currentCursor !== '') {
      cursorDefinition = {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }
    }

    return cursorDefinition
  }

  private getCursor(posts, limit: number) {
    let areMoreRecordsAvailable = false
    let cursor = ''

    if (posts.length === limit) {
      areMoreRecordsAvailable = true // INFO: if limit > taken records so there aren't more records to read.
    }
    if (areMoreRecordsAvailable) {
      const lastPostInResults = posts[limit - 1] // Remember: zero-based index! :)
      cursor = lastPostInResults.createdAt
    }

    return cursor
  }

  mapauthorBufferIdToUUID(posts) {
    return posts.map((post) => {
      const postWithUUID = {
        ...post,
      }
      postWithUUID.author.id = this.prismaService.mapBufferIdToString(post.author.id)

      postWithUUID.tags = post.tags.map((tag) => {
        const tagWithUUID = {
          ...tag,
        }
        tagWithUUID.author.id = this.prismaService.mapBufferIdToString(tag.author.id)

        return tagWithUUID
      })

      return postWithUUID
    })
  }

  // TODO: Add return type, is not q expected result
  // INFO: the usernamen is the email, it's called like this to be consist with the name defined in the JWT
  async create(createPostInput: CreatePostInput, username: string) {
    const { text, tag: tagText } = createPostInput

    const newPostPrismaData = {
      select: {
        id: true,
        text: true,
        createdAt: true,
        author: true,
        tags: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            author: true,
          },
        },
      },
      data: {
        text,
        author: {
          connect: {
            email: username,
          },
        },
        tags: {
          connectOrCreate: [
            {
              where: {
                text: tagText,
              },
              create: {
                text: tagText,
                author: {
                  connect: {
                    email: username,
                  },
                },
              },
            },
          ],
        },
      },
    }
    let post

    // INFO: try a create post twice because of added createdAt as unique to solve cursor pagination logic.
    try {
      post = await this.prismaService.post.create(newPostPrismaData)
    } catch (e) {
      post = await this.prismaService.post.create(newPostPrismaData)
    }

    // INFO: generate an array to reuse the same mapFunction
    const posts = [post]
    const mappedPost = this.mapauthorBufferIdToUUID(posts)[0]

    this.tagService.syncTagIndexWithAlgolia(tagText, mappedPost)

    return mappedPost
  }
}
