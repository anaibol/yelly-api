import { Injectable, UnauthorizedException } from '@nestjs/common'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { TagService } from 'src/tag/tag.service'
import { CreateCommentInput } from './create-comment.input'
import { PostSelect } from './post-select.constant'
import { PushNotificationService } from 'src/core/push-notification.service'
import { SendbirdService } from 'src/core/sendbird.service'

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private tagService: TagService,
    private pushNotificationService: PushNotificationService,
    private sendbirdService: SendbirdService
  ) {}
  async trackPostViews(postsIds: string[]) {
    await this.prismaService.post.updateMany({
      where: { id: { in: postsIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }

  async find(tagText, userId, schoolId: string, currentCursor, limit = DEFAULT_LIMIT) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      select: {
        school: {
          select: {
            city: {
              select: {
                country: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const posts = await this.prismaService.post.findMany({
      ...(tagText && {
        where: {
          tags: {
            every: {
              text: tagText,
            },
          },
        },
      }),
      ...(userId && {
        where: {
          authorId: userId,
        },
      }),
      ...(user.school.city.country.id && {
        where: {
          author: {
            is: {
              school: {
                city: {
                  country: {
                    id: user.school.city.country.id,
                  },
                },
              },
            },
          },
        },
      }),
      ...(schoolId && {
        where: {
          author: {
            schoolId,
          },
        },
      }),
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelect,
    })

    const nextCursor = posts.length === limit ? posts[limit - 1].createdAt.getTime().toString() : ''

    return { posts, nextCursor }
  }

  async getById(postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        ...PostSelect,
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
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
        },
      },
    })

    if (!post) throw new Error('Post not found')

    return post
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

    const deletedPost = await this.prismaService.post.delete({
      select: {
        id: true,
        tags: {
          select: {
            id: true,
            isLive: true,
            posts: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        id: postId,
      },
    })

    deletedPost.tags.forEach(async (tag) => {
      if (!tag.isLive && tag.posts.length == 1) this.tagService.deleteById(tag.id)
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

    const postReaction = await this.prismaService.postReaction.upsert({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      select: {
        authorId: true,
        id: true,
        postId: true,
        reaction: true,
        post: {
          select: {
            authorId: true,
          },
        },
      },
      create: {
        author: {
          connect: {
            id: authUserId,
          },
        },
        reaction,
        post: {
          connect: {
            id: postId,
          },
        },
      },
      update: reactionData,
    })

    if (postReaction.post.authorId !== authUserId) this.sendbirdService.sendPostReactionMessage(postReaction.id)

    return !!postReaction
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

    const comment = await this.prismaService.postComment.create({
      data: {
        text,
        postId,
        authorId: authUserId,
      },
    })

    await this.pushNotificationService.postComment(comment)

    return !!comment
  }
}
