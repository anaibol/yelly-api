import { PartialUpdateObjectResponse } from '@algolia/client-search'
import { Injectable } from '@nestjs/common'
import { ActivityType, NotificationType } from '@prisma/client'
import { AuthUser } from 'src/auth/auth.service'
import { AlgoliaService } from 'src/core/algolia.service'
import { PushNotificationService } from 'src/core/push-notification.service'
import { TagService } from 'src/tag/tag.service'

import { PrismaService } from '../core/prisma.service'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { CreatePostInput } from './create-post.input'
import { Post } from './post.model'
import { PostPollVote } from './post.model'
import { PostReaction } from './post-reaction.model'
import { mapPost, mapPostChild, PostChildSelect, PostSelectWithParent } from './post-select.constant'

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
    private tagService: TagService,
    private pushNotificationService: PushNotificationService,
    private algoliaService: AlgoliaService
  ) {}
  async trackPostViews(postIds: bigint[]): Promise<boolean> {
    await this.prismaService.post.updateMany({
      where: { id: { in: postIds } },
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

  async getPost(postId: bigint, limit: number, currentCursor?: bigint): Promise<Post | null> {
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

  async create(createPostInput: CreatePostInput, authUser: AuthUser): Promise<Post> {
    const { text, tagIds, pollOptions, parentId } = createPostInput

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
        activities: {
          create: {
            type: ActivityType.CREATED_POST,
            ...(tagIds &&
              tagIds.length > 0 && {
                tagId: tagIds[0],
              }),
            ...(parent &&
              parent.tags.length > 0 && {
                tagId: parent.tags[0].id,
              }),
            userId: authUser.id,
          },
        },
        ...(parent && {
          parent: {
            connect: {
              id: parentId,
            },
          },
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
        ...(tagIds &&
          tagIds.length > 0 && {
            tags: {
              connect: tagIds.map((tagId) => ({ id: tagId })),
            },
          }),
      },
    })

    this.syncPostIndexWithAlgolia(post.id)

    if (parentId) {
      this.pushNotificationService.repliedToYourPost(post.id)
    } else {
      if (tagIds) this.thereAreNewPostsOnYourTag(post.id, tagIds[0])
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
      },
    })

    if (!post) return Promise.reject(new Error('No post'))
    if (post.authorId !== authUser.id && authUser.isNotAdmin) return Promise.reject(new Error('No permission'))

    await this.prismaService.post.delete({
      where: {
        id: postId,
      },
    })

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
            tagId: postBeforeReaction.tags[0].id,
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

    if (post.author.id !== authUser.id) this.pushNotificationService.reactedToYourPost(reaction.id)

    return {
      ...reaction,
      post: mapPost(post),
    }
  }

  async deletePostReaction(postId: bigint, authUser: AuthUser): Promise<boolean> {
    const authorId = authUser.id

    await this.prismaService.postReaction.delete({
      where: {
        authorId_postId: { authorId, postId },
      },
    })

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
}
