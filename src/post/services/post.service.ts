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
          authorId: this.prismaService.mapStringIdToBuffer(userId),
        }),
        ...(currentCursor && {
          cursor: {
            createdAt: new Date(+currentCursor).toISOString(),
          },
          skip: 1, // Skip the cursor
        }),
      },
      select: {
        createdAt: true,
        viewsCount: true,
        text: true,
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

    const mappedPosts = this.mapAuthorBufferIdToUUID(posts)

    const cursor = posts.length === limit && posts[limit - 1].createdAt

    return { posts: mappedPosts, cursor }
  }

  mapAuthorBufferIdToUUID(posts) {
    return posts.map((post) => ({
      ...post,
      author: {
        id: this.prismaService.mapBufferIdToString(post.author.id),
        ...post.author,
      },
      tags: post.tags.map((tag) => {
        return {
          ...tag,
          author: {
            id: this.prismaService.mapBufferIdToString(tag.author.id),
            ...tag,
          },
        }
      }),
    }))
  }

  trackPostView(postId: string) {
    this.prismaService.post.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
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
    const mappedPost = this.mapAuthorBufferIdToUUID(posts)[0]

    this.tagService.syncTagIndexWithAlgolia(tagText, mappedPost)

    return mappedPost
  }
}
