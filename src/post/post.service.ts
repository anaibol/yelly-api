import { Injectable, UnauthorizedException } from '@nestjs/common'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { TagService } from './tag.service'

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService, private tagService: TagService) {}

  mapAuthorBufferIdToUUID(posts) {
    return posts.map((post) => ({
      ...post,
      author: {
        ...post.author,
        id: this.prismaService.mapBufferIdToString(post.author.id),
      },
      tags: post.tags.map((tag) => {
        return {
          ...tag,
          author: {
            ...tag.author,
            id: this.prismaService.mapBufferIdToString(tag.author.id),
          },
        }
      }),
      reactions: post.reactions.map((reaction) => {
        return {
          ...reaction,
          authorId: this.prismaService.mapBufferIdToString(reaction.authorId),
        }
      }),
      totalReactionsCount: post._count.reactions,
    }))
  }

  async trackPostViews(postsIds: string[]) {
    await this.prismaService.post.updateMany({
      where: { id: { in: postsIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }
  // TODO: Add return type, is not q expected result
  async find(tagText, userId, currentCursor, limit = DEFAULT_LIMIT) {
    const posts = await this.prismaService.post.findMany({
      where: {
        ...(tagText && {
          tags: {
            every: {
              text: tagText,
            },
          },
        }),
        ...(userId && {
          authorId: this.prismaService.mapStringIdToBuffer(userId),
        }),
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        _count: {
          select: {
            reactions: true,
          },
        },
        id: true,
        createdAt: true,
        viewsCount: true,
        text: true,
        reactions: {
          select: {
            id: true,
            reaction: true,
            authorId: true,
          },
          distinct: 'reaction',
          take: 3,
        },
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
    })

    const mappedPosts = this.mapAuthorBufferIdToUUID(posts)
    const cursor = posts.length === limit ? posts[limit - 1].createdAt : ''

    return { posts: mappedPosts, cursor }
  }

  async create(createPostInput: CreatePostInput, authUserId: string) {
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
            id: this.prismaService.mapStringIdToBuffer(authUserId),
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
                    id: this.prismaService.mapStringIdToBuffer(authUserId),
                  },
                },
              },
            },
          ],
        },
      },
    }

    const post = await this.prismaService.post.create(newPostPrismaData)

    const posts = [post]
    const mappedPost = this.mapAuthorBufferIdToUUID(posts)[0]

    this.tagService.syncTagIndexWithAlgolia(tagText, mappedPost)

    return mappedPost
  }

  async delete(createPostInput: DeletePostInput, authUserId: string) {
    const { id } = createPostInput

    if (!authUserId) return new UnauthorizedException()

    const deleted = await this.prismaService.post.deleteMany({
      where: {
        id,
        authorId: this.prismaService.mapStringIdToBuffer(authUserId),
      },
    })

    return deleted.count > 0
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUserId: string
  ) {
    const { text, postId } = createOrUpdatePostReactionInput
    const authorId = this.prismaService.mapStringIdToBuffer(authUserId)

    const reactionData = {
      text,
      reaction: text,
      authorId,
      postId,
    }

    await this.prismaService.postReaction.upsert({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      create: reactionData,
      update: reactionData,
    })

    return true
  }

  async deletePostReaction(deletePostReactionInput: DeletePostReactionInput, authUserId: string): Promise<boolean> {
    const { postId } = deletePostReactionInput
    const authorId = this.prismaService.mapStringIdToBuffer(authUserId)

    await this.prismaService.postReaction.delete({
      where: {
        authorId_postId: { authorId, postId },
      },
    })

    return true
  }
}
