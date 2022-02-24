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
import dates from 'src/utils/dates'

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

  async find(
    authUserCountryId: string,
    authUserBirthdate: Date,
    tagText?: string,
    schoolId?: string,
    currentCursor?: string,
    limit = DEFAULT_LIMIT
  ) {
    const userAge = authUserBirthdate && dates.getAge(authUserBirthdate)
    const datesRanges = dates.getDateRanges(userAge)

    const posts = await this.prismaService.post.findMany({
      where: {
        ...(tagText
          ? {
              tags: {
                every: {
                  text: tagText,
                },
              },
            }
          : {}),
        author: {
          ...(!schoolId && authUserCountryId
            ? {
                school: {
                  city: {
                    countryId: authUserCountryId,
                  },
                },
              }
            : {}),
          birthdate: datesRanges,
        },
        ...(schoolId
          ? {
              author: {
                schoolId,
              },
            }
          : {}),
      },
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
    return this.prismaService.post.findUnique({
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
