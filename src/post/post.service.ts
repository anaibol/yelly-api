import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { TagService } from 'src/tag/tag.service'
import { CreateCommentInput } from './create-comment.input'
import { PostSelect } from './post-select.constant'
import { PushNotificationService } from 'src/core/push-notification.service'
import { SendbirdService } from 'src/sendbird/sendbird.service'
import dates from 'src/utils/dates'
import { AlgoliaService } from 'src/core/algolia.service'
import { AuthUser } from 'src/auth/auth.service'
import { uniq } from 'lodash'
import { PaginatedPosts } from './paginated-posts.model'

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

  async findForYou(authUser: AuthUser, limit: number, currentCursor?: string): Promise<PaginatedPosts> {
    const userAge = authUser.birthdate && dates.getAge(authUser.birthdate)
    const datesRanges = userAge ? dates.getDateRanges(userAge) : undefined

    if (!authUser.schoolId) throw new Error('No user school')

    const school = await this.prismaService.school.findUnique({
      where: { id: authUser.schoolId },
    })

    if (!school) throw new Error('No user school')

    const authUserCountry = await this.prismaService.city
      .findUnique({
        where: { id: school.cityId },
      })
      .country()

    if (!authUserCountry) throw new Error('No country')

    if (!school) throw new Error('No school')

    const maxDistance = 50000
    const maxSchools = 50

    const nearSchools: { id: string; distance: number }[] = await this.prismaService.$queryRaw`
      select id, ROUND(ST_DISTANCE_SPHERE(coord, POINT(${school.lng}, ${school.lat})) / 1000, 2) AS distance
      from School having distance < ${maxDistance}
      order by distance asc
      limit ${maxSchools}
    `

    const posts = await this.prismaService.post.findMany({
      take: limit,
      where: {
        author: {
          NOT: {
            id: authUser.id,
          },
          OR: [
            {
              // Users from the around schools and on the same date range (it includes his school)
              birthdate: datesRanges,
              schoolId: {
                in: nearSchools.map(({ id }) => id), // it includes his school
              },
            },
            {
              friends: {
                some: {
                  // his friends
                  otherUser: {
                    OR: [
                      {
                        id: authUser.id,
                      },
                      // {
                      //   // and the friends of his friends
                      //   // if the author has as a friend in common with me it means he is a friend of a friend
                      //   school: {
                      //     city: {
                      //       countryId: authUserCountry.id,
                      //     },
                      //   },
                      //   friends: {
                      //     some: {
                      //       otherUserId: authUser.id,
                      //     },
                      //   },
                      // },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      // reactions: {
      //   some: {
      //     author: {
      //       friends: {
      //         some: {
      //           otherUserId: authUser.id,
      //         },
      //       },
      //     },
      //   },
      // },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      select: PostSelect,
    })

    const items = posts.map((p) => {
      const { school } = p.author

      if (!school) return p

      const nearSchool = nearSchools.find(({ id }) => id === school?.id)

      if (!nearSchool) return p

      return {
        ...p,
        author: {
          ...p.author,
          school: {
            ...school,
            distance: nearSchool.distance,
          },
        },
      }
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }

  async find(authUser: AuthUser, limit: number, currentCursor?: string): Promise<PaginatedPosts> {
    const userAge = authUser.birthdate && dates.getAge(authUser.birthdate)
    const datesRanges = userAge ? dates.getDateRanges(userAge) : undefined

    const authUserCountry = await this.prismaService.user
      .findUnique({
        where: { id: authUser.id },
      })
      .school()
      .city()
      .country()

    if (!authUserCountry) throw new Error('No country')

    const items = await this.prismaService.post.findMany({
      where: {
        author: {
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
      select: PostSelect,
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }

  // async getById(postId: string) {
  //   return this.prismaService.post.findUnique({
  //     where: { id: postId },
  //     select: {
  //       ...PostSelect,
  //       comments: {
  //         orderBy: {
  //           createdAt: 'asc',
  //         },
  //         select: {
  //           text: true,
  //           authorId: true,
  //           id: true,
  //           createdAt: true,
  //           author: {
  //             select: {
  //               id: true,
  //               pictureId: true,
  //               firstName: true,
  //               lastName: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   })
  // }

  async create(createPostInput: CreatePostInput, authUser: AuthUser) {
    const { text, tags } = createPostInput
    const uniqueTags = uniq(tags)

    const connectOrCreateTags = uniq(tags).map((tagText) => ({
      where: {
        text: tagText,
      },
      create: {
        text: tagText,
      },
    }))

    const { id } = await this.prismaService.post.create({
      select: {
        id: true,
      },
      data: {
        text,
        author: {
          connect: {
            id: authUser.id,
          },
        },
        tags: {
          connectOrCreate: connectOrCreateTags,
        },
      },
    })

    uniqueTags.map((tag) => this.tagService.syncTagIndexWithAlgolia(tag))
    this.syncPostIndexWithAlgolia(id)

    return { id }
  }

  async delete(createPostInput: DeletePostInput, authUser: AuthUser): Promise<boolean | UnauthorizedException> {
    const postId = createPostInput.id

    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    })

    if (!post || post.authorId !== authUser.id) return new UnauthorizedException()

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
      if (!tag.isLive && tag.posts.length == 1) this.tagService.deleteById(tag.id)
    })

    return true
  }

  async createOrUpdatePostReaction(
    createOrUpdatePostReactionInput: CreateOrUpdatePostReactionInput,
    authUser: AuthUser
  ) {
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

  async createComment(createCommentInput: CreateCommentInput, authUser: AuthUser) {
    const { postId, text } = createCommentInput

    const comment = await this.prismaService.postComment.create({
      data: {
        text,
        postId,
        authorId: authUser.id,
      },
    })

    await this.pushNotificationService.postComment(comment)

    return !!comment
  }

  async syncPostIndexWithAlgolia(id: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: PostSelect,
    })

    if (!post) throw new Error('No post found')

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

  async deletePostFromAlgolia(id: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('POSTS')
    this.algoliaService.deleteObject(algoliaTagIndex, id)
  }
}
