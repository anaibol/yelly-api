/* eslint-disable functional/no-let */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { TagService } from 'src/tag/tag.service'
import {
  PostSelectWithParent,
  mapPost,
  mapPostChild,
  PostChildSelect,
  getNotExpiredCondition,
} from './post-select.constant'
import { PushNotificationService } from 'src/core/push-notification.service'
import dates from 'src/utils/dates'
import { AlgoliaService } from 'src/core/algolia.service'
import { AuthUser } from 'src/auth/auth.service'
import { uniq } from 'lodash'
import { PaginatedPosts } from './paginated-posts.model'
import { Post } from './post.model'
import { PostPollVote } from './post.model'
import { Prisma } from '@prisma/client'
import { PartialUpdateObjectResponse } from '@algolia/client-search'
import { PostReaction } from './post-reaction.model'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'

const getExpiredAt = (expiresIn?: number | null): Date | undefined => {
  if (!expiresIn) return

  const now = new Date()

  const expiresAtTimestamp = now.setSeconds(now.getSeconds() + expiresIn)

  return new Date(expiresAtTimestamp)
}
@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private tagService: TagService,
    private pushNotificationService: PushNotificationService,
    private algoliaService: AlgoliaService
  ) {}
  async trackPostViews(postsIds: string[]): Promise<boolean> {
    await this.prismaService.post.updateMany({
      where: { id: { in: postsIds } },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }

  // async findForYou(authUser: AuthUser, limit: number, currentCursor?: string): Promise<PaginatedPosts> {
  //   const userAge = authUser.birthdate && dates.getAge(authUser.birthdate)
  //   const datesRanges = userAge ? dates.getDateRanges(userAge) : undefined

  //   if (!authUser.schoolId) return Promise.reject(new Error('No user school'))

  //   const school = await this.prismaService.school.findUnique({
  //     where: { id: authUser.schoolId },
  //   })
  // if (!school) return Promise.reject(new Error('No school'))

  // const maxDistance = 5 // 5Km
  // const maxSchools = 50

  // const nearSchools: { id: string; distance: number }[] = await this.prismaService.$queryRaw`
  //   select * from (
  //     select id, round(cast(ST_DistanceSphere(ST_SetSRID(ST_MakePoint(lng,lat),4326), ST_SetSRID(ST_MakePoint(${school.lng}, ${school.lat}),4326)) / 1000 as Numeric), 2) as distance
  //     from public."School"
  //   ) as schools
  //   where distance < ${maxDistance}
  //   order by distance asc
  //   limit ${maxSchools}
  // `

  //   const authUserCountry = await this.prismaService.city
  //     .findUnique({
  //       where: { id: school.cityId },
  //     })
  //     .country()

  //   if (!authUserCountry) return Promise.reject(new Error('No country'))

  //   if (!school) return Promise.reject(new Error('No school'))

  // const maxDistance = 5 // 5Km
  // const maxSchools = 50

  // const nearSchools: { id: string; distance: number }[] = await this.prismaService.$queryRaw`
  //   select * from (
  //     select id, round(cast(ST_Distance(ST_MakePoint(lng,lat)::geography, ST_MakePoint(${school.lng}, ${school.lat})::geography) / 1000 as Numeric), 2) as distance
  //     from public."School"
  //   ) as schools
  //   where distance < ${maxDistance}
  //   order by distance asc
  //   limit ${maxSchools}
  // `

  //   const posts = await this.prismaService.post.findMany({
  //     take: limit,
  //     where: {
  //       author: {
  //         NOT: {
  //           id: authUser.id,
  //         },
  //         OR: [
  //           {
  //             // Users from the around schools and on the same date range (it includes his school)
  //             birthdate: datesRanges,
  //             schoolId: {
  //               in: nearSchools.map(({ id }) => id), // it includes his school
  //             },
  //           },
  //           {
  //             friends: {
  //               some: {
  //                 // his friends
  //                 otherUser: {
  //                   OR: [
  //                     {
  //                       id: authUser.id,
  //                     },
  //                     // {
  //                     //   // and the friends of his friends
  //                     //   // if the author has as a friend in common with me it means he is a friend of a friend
  //                     //   school: {
  //                     //     city: {
  //                     //       countryId: authUserCountry.id,
  //                     //     },
  //                     //   },
  //                     //   friends: {
  //                     //     some: {
  //                     //       otherUserId: authUser.id,
  //                     //     },
  //                     //   },
  //                     // },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     ...(currentCursor && {
  //       cursor: {
  //         id: currentCursor,
  //       },
  //       skip: 1,
  //     }),
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //     select: PostSelectWithParent,
  //   })

  //   const items = posts.map((post) => {
  //     const { school } = post.author

  //     if (!school) return post

  //     const nearSchool = nearSchools.find(({ id }) => id === school?.id)

  //     if (!nearSchool) return post

  //     const pollOptions = post.pollOptions.map((o) => ({
  //       id: o.id,
  //       text: o.text,
  //       votesCount: o._count.votes,
  //     }))

  //     return {
  //       ...post,
  //       ...(pollOptions.length && { pollOptions }),
  //       author: {
  //         ...post.author,
  //         school: {
  //           ...school,
  //           distance: nearSchool.distance,
  //         },
  //       },
  //     }
  //   })

  //   const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

  //   return { items, nextCursor }
  // }

  async getPost(postId: string, limit: number, currentCursor?: string): Promise<Post | null> {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        ...PostSelectWithParent,
        children: {
          ...PostChildSelect,
          orderBy: {
            createdAt: 'desc',
          },
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

    const items = post.children.map((child) => mapPostChild(child, post))

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : ''

    return {
      ...mapPost(post),
      children: {
        items,
        nextCursor,
      },
    }
  }

  async create(createPostInput: CreatePostInput, authUser: AuthUser): Promise<Post> {
    const { text, emojis, expiresIn, tags, pollOptions, parentId } = createPostInput

    const uniqueTags = tags && tags.length > 0 ? uniq(tags) : ['NoTag']

    const parent = parentId
      ? await this.prismaService.post.findUnique({
          where: { id: parentId },
          include: {
            tags: true,
            author: true,
          },
        })
      : null

    const connectOrCreateTags = uniqueTags.map(
      (tagText): Prisma.TagCreateOrConnectWithoutPostsInput => ({
        where: {
          text: tagText,
        },
        create: {
          text: tagText,
          countryId: authUser.countryId,
          authorId: authUser.id,
        },
      })
    )

    const connectOrCreateEmojis = uniq(emojis).map(
      (emoji): Prisma.TagCreateOrConnectWithoutPostsInput => ({
        where: {
          text: emoji,
        },
        create: {
          text: emoji,
          countryId: authUser.countryId,
          isEmoji: true,
          authorId: authUser.id,
        },
      })
    )

    const threadId =
      parent &&
      (parent.threadId ||
        (
          await this.prismaService.thread.create({
            data: {
              posts: {
                connect: {
                  id: parent.id,
                },
              },
            },
          })
        ).id)

    const post = await this.prismaService.post.create({
      include: {
        tags: true,
      },
      data: {
        text,
        charsCount: text.length,
        wordsCount: text.split(/\s+/).length,
        expiresAt: parent ? parent.expiresAt : getExpiredAt(expiresIn),
        expiresIn: parent ? parent.expiresIn : expiresIn,
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
        ...(parent && {
          parent: {
            connect: {
              id: parent.id,
            },
          },
        }),
        ...(threadId && {
          thread: {
            connect: {
              id: threadId,
            },
          },
        }),
        tags: {
          connectOrCreate: [...connectOrCreateTags, ...connectOrCreateEmojis],
        },
      },
    })

    if (parent) {
      if (!parent?.parentId) {
        await this.prismaService.feedEvent.create({
          data: {
            postId: parent.id,
            tagId: parent.tags[0].id,
            type: 'POST_REPLY_CREATED',
            postAuthorBirthdate: parent.author.birthdate,
            postAuthorSchoolId: parent.author.schoolId,
          },
        })
      }
    } else {
      await this.prismaService.feedEvent.create({
        data: {
          postId: post.id,
          tagId: post.tags[0].id,
          type: 'POST_CREATED',
          postAuthorBirthdate: authUser.birthdate,
          postAuthorSchoolId: authUser.schoolId,
        },
      })
    }

    uniqueTags.map((tag) => this.tagService.syncTagIndexWithAlgolia(tag))

    this.syncPostIndexWithAlgolia(post.id)

    const hasExcludedTags = post.tags?.some((tag) => tag.isHidden)

    if (parentId && !hasExcludedTags) {
      this.pushNotificationService.postReplied(post.id)
    } else if (!hasExcludedTags) {
      this.pushNotificationService.followeePosted(post.id)
    }

    if (!parentId) this.pushNotificationService.sameSchoolPosted(post.id, authUser.id)

    return post
  }

  async delete(postId: string, authUser: AuthUser): Promise<boolean> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    })

    if (!post) return Promise.reject(new Error('No post'))
    if (post.authorId !== authUser.id && authUser.isNotAdmin) return Promise.reject(new Error('No permission'))

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

    this.deletePostFromAlgolia(postId)

    deletedPost.tags.forEach(async (tag) => {
      if (!tag.isLive && tag.posts.length === 1) this.tagService.delete(tag.id)
    })

    return true
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUser: AuthUser
  ): Promise<PostReaction> {
    const { text, postId } = createOrUpdatePostReactionInput
    const authorId = authUser.id

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

    await this.prismaService.feedEvent.create({
      data: {
        postId,
        postReactionId: reaction.id,
        tagId: post.tags[0].id,
        type: 'POST_REACTION_CREATED',
        postReactionAuthorBirthdate: authUser.birthdate,
        postReactionAuthorSchoolId: authUser.schoolId,
      },
    })

    if (post.author.id !== authUser.id) this.pushNotificationService.newPostReaction(reaction)

    return {
      ...reaction,
      post: mapPost(post),
    }
  }

  async deletePostReaction(deletePostReactionInput: DeletePostReactionInput, authUser: AuthUser): Promise<boolean> {
    const { postId } = deletePostReactionInput
    const authorId = authUser.id

    await this.prismaService.postReaction.delete({
      where: {
        authorId_postId: { authorId, postId },
      },
    })

    return true
  }

  async createPollVote(postId: string, optionId: string, authUser: AuthUser): Promise<Post> {
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

  async getAuthUserPollVote(postId: string, authUser: AuthUser): Promise<PostPollVote | null> {
    const authUserVotes = await this.prismaService.user
      .findUnique({
        where: {
          id: authUser.id,
        },
      })
      .postPollVotes({
        where: {
          postId,
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

    if (!authUserVotes.length) return null

    return authUserVotes[0]
  }

  async getAuthUserReaction(postId: string, authUser: AuthUser): Promise<PostReaction | null> {
    const authUserPostReaction = await this.prismaService.user
      .findUnique({
        where: {
          id: authUser.id,
        },
      })
      .postReactions({
        where: {
          postId,
        },
      })

    if (!authUserPostReaction.length) return null

    return authUserPostReaction[0]
  }

  async syncPostIndexWithAlgolia(id: string): Promise<PartialUpdateObjectResponse | undefined> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: PostSelectWithParent,
    })

    if (!post || post.expiresAt) return

    const objectToCreate = {
      id: post.id,
      objectID: post.id,
      createdAt: post.createdAt,
      createdAtTimestamp: Date.parse(post.createdAt.toString()),
      text: post.text,
      author: post.author,
      tags: post.tags,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToCreate, post.id)
  }

  async deletePostFromAlgolia(id: string): Promise<void> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
  }

  async postsUserReactions(
    postIds: string[],
    userId: string
  ): Promise<
    {
      postId: string
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
          in: postIds as string[],
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
}
