import { PartialUpdateObjectResponse } from '@algolia/client-search'
import { Injectable } from '@nestjs/common'
import { ActivityType, NotificationType, Prisma } from '@prisma/client'
import { AuthUser } from 'src/auth/auth.service'
import { AlgoliaService } from 'src/core/algolia.service'
import { PushNotificationService } from 'src/core/push-notification.service'

import { SortDirection } from '../app.module'
import { BodyguardService } from '../core/bodyguard.service'
import { PrismaService } from '../core/prisma.service'
import { PostsSortBy } from '../posts/posts.args'
import { TagService } from '../tag/tag.service'
import { UserService } from '../user/user.service'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { CreatePostInput } from './create-post.input'
import { PaginatedPosts } from './paginated-posts.model'
import { Post } from './post.model'
import { PostPollVote } from './post.model'
import { PostReaction } from './post-reaction.model'
import { mapPost, mapPostChild, PostChildSelect, PostSelectWithParent } from './post-select.constant'

const getPostsSort = (
  sortBy?: PostsSortBy,
  sortDirection?: SortDirection
): Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> => {
  switch (sortBy) {
    case 'childrenCount':
      return {
        children: {
          _count: sortDirection,
        },
      }

    case 'reactionsCount':
      return [
        {
          reactions: {
            _count: sortDirection,
          },
        },
        {
          createdAt: 'desc' as const,
        },
      ]

    default:
      return {
        createdAt: sortDirection,
      }
  }
}

const getNewPostCount = (postCount: number): number | undefined => {
  switch (postCount) {
    case 1:
      return 1

    case 6:
      return 5

    case 26:
      return 20

    case 126:
      return 100
  }
}

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private pushNotificationService: PushNotificationService,
    private tagService: TagService,
    private algoliaService: AlgoliaService,
    private bodyguardService: BodyguardService,
    private userService: UserService
  ) {}
  async trackPostViews(postIds: bigint[]): Promise<boolean> {
    await this.prismaService.post.updateMany({
      where: { id: { in: postIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }

  async getPost(
    postId: bigint,
    limit: number,
    currentCursor?: bigint,
    childrenSortBy?: PostsSortBy,
    childrenSortDirection?: SortDirection
  ): Promise<Post | null> {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        ...PostSelectWithParent,
        children: {
          ...PostChildSelect,
          orderBy: getPostsSort(childrenSortBy, childrenSortDirection),
          ...(currentCursor && {
            cursor: {
              id: currentCursor,
            },
            skip: 1,
          }),
          take: limit,
        },
      },
    })

    if (!post) return Promise.reject(new Error('No post'))

    const items = post.children.map((child) => mapPostChild(child))

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return {
      ...mapPost(post),
      children: {
        items,
        nextCursor,
      },
    }
  }

  async getPosts(
    authUser: AuthUser,
    authorId?: string,
    tagId?: bigint,
    after?: bigint,
    limit?: number,
    sortBy?: PostsSortBy,
    sortDirection?: SortDirection
  ): Promise<PaginatedPosts> {
    const posts = await this.prismaService.post.findMany({
      where: {
        author: {
          isBanned: false,
          blockedUsers: {
            none: {
              id: authUser.id,
            },
          },
          blockedByUsers: {
            none: {
              id: authUser.id,
            },
          },
        },
        ...(authorId && {
          authorId,
        }),
        ...(tagId && {
          tags: {
            some: {
              id: tagId,
            },
          },
        }),
      },
      ...(after && {
        cursor: {
          id: after,
        },
        skip: 1,
      }),
      orderBy: getPostsSort(sortBy, sortDirection),
      take: limit,
      select: PostSelectWithParent,
    })

    const items = posts.map(mapPost)

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor }
  }

  async create(createPostInput: CreatePostInput, authUser: AuthUser): Promise<Post> {
    const { text, tagIds, pollOptions, parentId, mentionedUserIds } = createPostInput

    const parent =
      parentId &&
      (await this.prismaService.post.findUnique({
        where: {
          id: parentId,
        },
        include: {
          tags: true,
        },
      }))

    const post = await this.prismaService.post.create({
      data: {
        text,
        charsCount: text.length,
        wordsCount: text.split(/\s+/).length,
        ...(pollOptions &&
          pollOptions.length > 0 && {
            pollOptions: {
              createMany: {
                data: pollOptions.map((text, i) => ({ text, position: i })),
              },
            },
          }),
        author: {
          connect: {
            id: authUser.id,
          },
        },
        ...(mentionedUserIds &&
          mentionedUserIds.length > 0 && {
            userMentions: {
              createMany: {
                data: mentionedUserIds.map((userId) => ({
                  userId,
                })),
              },
            },
          }),
        ...(tagIds &&
          tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((tagId) => ({ id: tagId })),
            },
            activities: {
              create: {
                type: ActivityType.CREATED_POST,
                tagId: tagIds[0],
                userId: authUser.id,
              },
            },
          }),
        ...(parent && {
          parent: {
            connect: {
              id: parentId,
            },
          },
          ...(authUser.id !== parent.authorId && {
            notifications: {
              create: {
                userId: parent.authorId,
                type: NotificationType.REPLIED_TO_YOUR_POST,
                ...(parent &&
                  parent.tags.length > 0 && {
                    tagId: parent.tags[0].id,
                  }),
              },
            },
          }),
        }),
      },
    })

    const parentTagIds = parent ? parent?.tags?.map((tag) => tag.id) : undefined
    const associatedTag = await this.getAssociatedTag(authUser, tagIds, parentTagIds)

    if (associatedTag) {
      this.tagService.updateInteractionsCount(associatedTag.id)
      this.bodyguardService.analyseComment(post, authUser, associatedTag)
    }

    this.syncPostIndexWithAlgolia(post.id)

    if (parent && authUser.id !== parent.authorId) {
      this.pushNotificationService.repliedToYourPost(post.id)
    } else if (tagIds && tagIds.length > 0) {
      this.thereAreNewPostsOnYourTag(post.id, tagIds[0])
    }

    if (mentionedUserIds && mentionedUserIds.length > 0) {
      this.pushNotificationService.youHaveBeenMentioned(post.id)

      const postUserMentions = await this.prismaService.postUserMention.findMany({ where: { postId: post.id } })

      if (!postUserMentions) return Promise.reject(new Error('No mentions'))

      if (tagIds && tagIds.length > 0) {
        await Promise.all([
          this.prismaService.activity.createMany({
            data: postUserMentions.map((mention) => ({
              postUserMentionId: mention.id,
              userId: authUser.id,
              postId: post.id,
              type: ActivityType.CREATED_POST_USER_MENTION,
              tagId: tagIds[0],
            })),
          }),
          this.prismaService.notification.createMany({
            data: postUserMentions.map((mention) => ({
              postUserMentionId: mention.id,
              userId: mention.userId,
              postId: post.id,
              type: NotificationType.USER_MENTIONED_YOU,
              tagId: tagIds[0],
            })),
          }),
        ])
      }
    }

    return post
  }

  async thereAreNewPostsOnYourTag(postId: bigint, tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!tag?.authorId) return Promise.reject(new Error('No tag author'))

    const newPostCount = getNewPostCount(tag._count.posts)

    if (!newPostCount) return

    await this.prismaService.notification.create({
      data: {
        userId: tag.authorId,
        type: NotificationType.THERE_ARE_NEW_POSTS_ON_YOUR_TAG,
        tagId: tag.id,
        postId: postId,
        newPostCount,
      },
    })

    this.pushNotificationService.thereAreNewPostsOnYourTag(tag.authorId, tag.id, newPostCount)
  }

  async delete(postId: bigint, authUser: AuthUser): Promise<boolean> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
        tags: true,
        parent: {
          select: {
            tags: true,
          },
        },
      },
    })

    if (!post) return Promise.reject(new Error('No post'))
    if (post.authorId !== authUser.id && authUser.isNotAdmin) return Promise.reject(new Error('No permission'))

    await this.prismaService.post.delete({
      where: {
        id: postId,
      },
    })

    if (post.tags && post.tags.length > 0) {
      this.tagService.updateInteractionsCount(post.tags[0].id, false)
    } else {
      if (post.parent && post.parent.tags && post.parent.tags.length > 0) {
        this.tagService.updateInteractionsCount(post.parent.tags[0].id, false)
      }
    }

    this.deletePostFromAlgolia(postId)

    return true
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUser: AuthUser
  ): Promise<PostReaction> {
    const { text, postId } = createOrUpdatePostReactionInput
    const authorId = authUser.id

    const postBeforeReaction = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        tags: true,
      },
    })

    if (!postBeforeReaction) return Promise.reject(new Error('No post'))

    const { post, ...reaction } = await this.prismaService.postReaction.upsert({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      create: {
        author: {
          connect: {
            id: authUser.id,
          },
        },
        text,
        post: {
          connect: {
            id: postId,
          },
        },
        notification: {
          create: {
            userId: postBeforeReaction.authorId,
            type: NotificationType.REACTED_TO_YOUR_POST,
            ...(postBeforeReaction.tags.length > 0 && {
              tagId: postBeforeReaction.tags[0].id,
            }),
          },
        },
      },
      update: {
        text,
        authorId,
        postId,
      },
      include: {
        post: {
          select: PostSelectWithParent,
        },
      },
    })

    const associatedTag = await this.getPostAssociatedTag(authUser, post)

    if (associatedTag) {
      this.tagService.updateInteractionsCount(associatedTag.id)
    }

    if (post.author.id !== authUser.id) this.pushNotificationService.reactedToYourPost(reaction.id)

    return {
      ...reaction,
      post: mapPost(post),
    }
  }

  async deletePostReaction(postId: bigint, authUser: AuthUser): Promise<boolean> {
    const authorId = authUser.id

    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        tags: true,
        parent: {
          select: {
            tags: true,
          },
        },
      },
    })

    if (!post) return Promise.reject(new Error('No post'))

    await this.prismaService.postReaction.delete({
      where: {
        authorId_postId: { authorId, postId },
      },
    })

    if (post.tags && post.tags.length > 0) {
      this.tagService.updateInteractionsCount(post.tags[0].id, false)
    } else {
      if (post.parent && post.parent.tags && post.parent.tags.length > 0) {
        this.tagService.updateInteractionsCount(post.parent.tags[0].id, false)
      }
    }

    return true
  }

  async createPollVote(postId: bigint, optionId: bigint, authUser: AuthUser): Promise<Post> {
    const pollWithOption = this.prismaService.postPollOption.findFirst({
      where: {
        id: optionId,
        postId,
      },
    })

    if (!pollWithOption) return Promise.reject(new Error('No poll with option'))

    await this.prismaService.postPollVote.create({
      data: {
        post: {
          connect: {
            id: postId,
          },
        },
        option: {
          connect: {
            id: optionId,
          },
        },
        author: {
          connect: {
            id: authUser.id,
          },
        },
      },
    })

    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: PostSelectWithParent,
    })

    if (!post) return Promise.reject(new Error('No post'))

    return mapPost(post)
  }

  getAuthUserPollVote(postId: bigint, authUser: AuthUser): Promise<PostPollVote | null> {
    return this.prismaService.postPollVote.findUnique({
      where: {
        authorId_postId: {
          authorId: authUser.id,
          postId,
        },
      },
      select: {
        id: true,
        option: {
          select: {
            id: true,
          },
        },
      },
    })
  }

  getAuthUserReaction(postId: bigint, authUser: AuthUser): Promise<PostReaction | null> {
    return this.prismaService.postReaction.findUnique({
      where: {
        authorId_postId: {
          authorId: authUser.id,
          postId,
        },
      },
    })
  }

  async syncPostIndexWithAlgolia(postId: bigint): Promise<PartialUpdateObjectResponse | undefined> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      select: PostSelectWithParent,
    })

    if (!post) return

    const postIdString = post.id.toString()

    const objectToCreate = {
      id: postIdString,
      objectID: postIdString,
      createdAt: post.createdAt,
      createdAtTimestamp: Date.parse(post.createdAt.toString()),
      text: post.text,
      author: post.author,
      tags: post.tags,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToCreate, postIdString)
  }

  async deletePostFromAlgolia(postId: bigint): Promise<void> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    this.algoliaService.deleteObject(algoliaTagIndex, postId.toString())
  }

  async postsUserReactions(
    postIds: bigint[],
    userId: string
  ): Promise<
    {
      postId: bigint
      reaction?: PostReaction
    }[]
  > {
    if (postIds.length === 1) {
      const [postId] = postIds

      const reaction = await this.prismaService.postReaction.findUnique({
        where: {
          authorId_postId: {
            postId,
            authorId: userId,
          },
        },
      })

      return [
        {
          postId,
          ...(reaction && {
            reaction,
          }),
        },
      ]
    }

    const reactions = await this.prismaService.postReaction.findMany({
      where: {
        authorId: userId,
        postId: {
          in: postIds as bigint[],
        },
      },
    })

    return postIds.map((postId) => {
      const reaction = reactions.find((reaction) => reaction.postId === postId)

      return {
        postId,
        reaction,
      }
    })
  }

  async getPostAssociatedTag(authUser: AuthUser, post: Post) {
    const tagIds = post.tags?.map((tag) => tag.id)
    const parentTagIds = post?.parent?.tags && post.parent?.tags.map((tag) => tag.id)
    return this.getAssociatedTag(authUser, tagIds, parentTagIds)
  }

  async getAssociatedTag(authUser: AuthUser, tagIds: bigint[] | undefined, parentTagIds: bigint[] | undefined) {
    if (tagIds && tagIds.length > 0) {
      // TODO: Performance optimization: add a tag parameter to create post
      return await this.tagService.getTag(tagIds[0], authUser)
    } else {
      if (parentTagIds && parentTagIds.length > 0) {
        return await this.tagService.getTag(parentTagIds[0], authUser)
      }
    }
  }
}
