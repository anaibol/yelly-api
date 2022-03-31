import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { TagService } from 'src/tag/tag.service'
import { PostSelectWithParent, mapPost, mapPostChild, PostChildSelect } from './post-select.constant'
import { PushNotificationService } from 'src/core/push-notification.service'
import { SendbirdService } from 'src/sendbird/sendbird.service'
import dates from 'src/utils/dates'
import { AlgoliaService } from 'src/core/algolia.service'
import { AuthUser } from 'src/auth/auth.service'
import { uniq } from 'lodash'
import { PaginatedPosts } from './paginated-posts.model'
import { Post } from './post.model'
import { PostPollVote } from './post.model'
@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private tagService: TagService,
    private pushNotificationService: PushNotificationService,
    private sendbirdService: SendbirdService,
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

  //   if (!school) return Promise.reject(new Error('No user school'))

  //   const authUserCountry = await this.prismaService.city
  //     .findUnique({
  //       where: { id: school.cityId },
  //     })
  //     .country()

  //   if (!authUserCountry) return Promise.reject(new Error('No country'))

  //   if (!school) return Promise.reject(new Error('No school'))

  //   const maxDistance = 50000
  //   const maxSchools = 50

  //   const nearSchools: { id: string; distance: number }[] = await this.prismaService.$queryRaw`
  //     select id, ROUND(ST_DISTANCE_SPHERE(coord, POINT(${school.lng}, ${school.lat})) / 1000, 2) AS distance
  //     from School having distance < ${maxDistance}
  //     order by distance asc
  //     limit ${maxSchools}
  //   `

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
  //     // reactions: {
  //     //   some: {
  //     //     author: {
  //     //       friends: {
  //     //         some: {
  //     //           otherUserId: authUser.id,
  //     //         },
  //     //       },
  //     //     },
  //     //   },
  //     // },
  //     ...(currentCursor && {
  //       cursor: {
  //         createdAt: new Date(+currentCursor).toISOString(),
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

  async find(authUser: AuthUser, limit: number, currentCursor?: string): Promise<PaginatedPosts> {
    const userAge = authUser.birthdate && dates.getAge(authUser.birthdate)
    const datesRanges = userAge ? dates.getDateRanges(userAge) : undefined

    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    if (!authUserCountry) return Promise.reject(new Error('No country'))

    const posts = await this.prismaService.post.findMany({
      where: {
        OR: [
          {
            expiresAt: {
              gte: new Date(),
            },
          },
          {
            expiresAt: null,
          },
        ],
        author: {
          isActive: true,
          school: {
            city: {
              countryId: authUserCountry.id,
            },
          },
          birthdate: datesRanges,
        },
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
      select: PostSelectWithParent,
    })

    const items = posts.map(mapPost)

    const lastItem = items.length === limit && items[limit - 1]

    const lastCreatedAt = lastItem && lastItem.createdAt

    const nextCursor = lastCreatedAt ? lastCreatedAt.getTime().toString() : ''

    return { items, nextCursor }
  }

  async getById(postId: string, limit: number, currentCursor?: string): Promise<Post | null> {
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
              createdAt: new Date(+currentCursor).toISOString(),
            },
            skip: 1,
          }),
          take: limit,
        },
      },
    })

    if (!post) return Promise.reject(new Error('No post'))

    const items = post.children.map(mapPostChild)

    const lastItem = items.length === limit && items[limit - 1]

    const lastCreatedAt = lastItem && lastItem.createdAt

    const nextCursor = lastCreatedAt ? lastCreatedAt.getTime().toString() : ''

    return {
      ...mapPost(post),
      children: {
        items,
        nextCursor,
      },
    }
  }

  async create(createPostInput: CreatePostInput, authUser: AuthUser): Promise<Post> {
    const { text, expiresAt, expiresIn, tags, pollOptions, parentId } = createPostInput

    const uniqueTags = uniq(tags)

    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const authUserCountry = await this.prismaService.school
      .findUnique({
        where: { id: authUser.schoolId },
      })
      .city()
      .country()

    const connectOrCreateTags = uniq(tags).map((tagText) => ({
      where: {
        text: tagText,
      },
      create: {
        text: tagText,
        countryId: authUserCountry?.id,
      },
    }))

    const { id } = await this.prismaService.post.create({
      data: {
        text,
        expiresAt,
        expiresIn,
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
        ...(parentId && {
          parent: {
            connect: {
              id: parentId,
            },
          },
        }),
        tags: {
          connectOrCreate: connectOrCreateTags,
        },
      },
    })

    uniqueTags.map((tag) => this.tagService.syncTagIndexWithAlgolia(tag))
    this.syncPostIndexWithAlgolia(id)

    return { id }
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
      if (!tag.isLive && tag.posts.length == 1) this.tagService.delete(tag.id)
    })

    return true
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUser: AuthUser
  ): Promise<boolean> {
    const { reaction, postId } = createOrUpdatePostReactionInput
    const authorId = authUser.id

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
            id: authUser.id,
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

    if (postReaction.post.authorId !== authUser.id) this.sendbirdService.sendPostReactionMessage(postReaction.id)

    return !!postReaction
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

  async syncPostIndexWithAlgolia(id: string): Promise<undefined> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: PostSelectWithParent,
    })

    if (!post) return Promise.reject(new Error('No post found'))

    const objectToCreate = {
      id: post.id,
      objectID: post.id,
      createdAt: post.createdAt,
      createdAtTimestamp: Date.parse(post.createdAt.toString()),
      text: post.text,
      author: post.author,
      tags: post.tags,
    }

    this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToCreate, post.id)
  }

  async deletePostFromAlgolia(id: string): Promise<void> {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
  }
}
