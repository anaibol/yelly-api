import { Injectable, UnauthorizedException } from '@nestjs/common'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { TagService } from 'src/tag/tag.service'
import { CreateCommentInput } from './create-comment-input'

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService, private tagService: TagService) {}

  async trackPostViews(postsIds: string[]) {
    await this.prismaService.post.updateMany({
      where: { id: { in: postsIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }
  // TODO: Add return type, is not q expected result
  async find(tagText, userId, schoolId: string, currentCursor, limit = DEFAULT_LIMIT) {
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
          authorId: userId,
        }),
        ...(schoolId && {
          author: {
            schoolId,
          },
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
            comments: true,
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
          take: 2,
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

    const mappedPosts = posts.map((post) => ({
      ...post,
      totalReactionsCount: post._count.reactions,
      totalCommentsCount: post._count.comments,
    }))

    const cursor = posts.length === limit ? posts[limit - 1].createdAt : ''

    return { posts: mappedPosts, cursor }
  }

  async getById(postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        _count: {
          select: {
            reactions: true,
            comments: true,
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
          take: 2,
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
        comments: {
          select: {
            text: true,
            authorId: true,
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
          },
          orderBy: {
            createdAt: 'desc',
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

    return {
      ...post,
      totalReactionsCount: post._count.reactions,
      totalCommentsCount: post._count.comments,
    }
  }
  async create(createPostInput: CreatePostInput, authUserId: string) {
    const { text, tag: tagText } = createPostInput

    const { id } = await this.prismaService.post.create({
      select: {
        id: true,
      },
      data: {
        text,
        author: {
          connect: {
            id: authUserId,
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
                    id: authUserId,
                  },
                },
              },
            },
          ],
        },
      },
    })

    this.tagService.syncTagIndexWithAlgolia(tagText)

    return { id }
  }

  async delete(createPostInput: DeletePostInput, authUserId: string): Promise<boolean | UnauthorizedException> {
    const postId = createPostInput.id

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    })

    if (!post || post.authorId !== authUserId) return new UnauthorizedException()

    await this.prismaService.post.delete({
      select: {
        id: true,
      },
      where: {
        id: postId,
      },
    })
    return true
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUserId: string
  ) {
    const { reaction, postId } = createOrUpdatePostReactionInput
    const authorId = authUserId

    const reactionData = {
      reaction,
      authorId,
      postId,
    }

    const updated = await this.prismaService.postReaction.upsert({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      create: reactionData,
      update: reactionData,
    })

    return !!updated
  }

  async deletePostReaction(deletePostReactionInput: DeletePostReactionInput, authUserId: string): Promise<boolean> {
    const { postId } = deletePostReactionInput
    const authorId = authUserId

    await this.prismaService.postReaction.delete({
      where: {
        authorId_postId: { authorId, postId },
      },
    })

    return true
  }

  async createComment(createCommentInput: CreateCommentInput, authUserId: string) {
    const { postId, text } = createCommentInput

    const updated = await this.prismaService.postComment.create({
      data: {
        text,
        postId,
        authorId: authUserId,
      },
    })

    return !!updated
  }
}
