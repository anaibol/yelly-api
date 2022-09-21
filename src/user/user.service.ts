import { PartialUpdateObjectResponse } from '@algolia/client-search'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { NotificationType, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { AuthUser } from 'src/auth/auth.service'
import { PushNotificationService } from 'src/core/push-notification.service'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { PostService } from 'src/post/post.service'
import { Payload, RequestBuilder } from 'yoti'

import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { SortDirection } from '../app.module'
import { AlgoliaService } from '../core/algolia.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SchoolService } from '../school/school.service'
import { TagService } from '../tag/tag.service'
import { deleteObject, getObject } from '../utils/aws'
import { AgePredictionResult, AgeVerificationResult, Me } from './me.model'
import { UpdateUserInput } from './update-user.input'
import { User } from './user.model'
import { UserFolloweesSortBy } from './user-followees.args'

type YotiResponse = {
  antispoofing: {
    prediction: AgePredictionResult
  }
  age: {
    st_dev: number
    age: number
  }
}

const getUserFolloweesSort = (
  sortBy?: UserFolloweesSortBy,
  sortDirection?: SortDirection
): Prisma.Enumerable<Prisma.FollowerOrderByWithRelationInput> => {
  switch (sortBy) {
    case 'displayName':
      return {
        followee: {
          displayName: sortDirection,
        },
      }

    default:
      return {
        createdAt: sortDirection,
      }
  }
}

const checkAge = async (
  pictureId: string
): Promise<{
  isAgeApproved: boolean
  ageEstimation: number
  agePredictionResult: string
}> => {
  const img = await getObject(pictureId)

  const data = {
    img,
  }

  const request = new RequestBuilder()
    .withBaseUrl('https://api.yoti.com/ai/v1')
    .withPemFilePath(process.env.YOTI_KEY_FILE_PATH)
    .withEndpoint('/age-antispoofing')
    .withPayload(new Payload(data))
    .withMethod('POST')
    .withHeader('X-Yoti-Auth-Id', process.env.YOTI_CLIEND_SDK_ID)
    .build()

  const response = await request.execute()

  const result: YotiResponse = JSON.parse(response.body)

  const isAgeApproved = result.antispoofing.prediction === 'real' && result.age.age >= 13 && result.age.age <= 25

  return Promise.resolve({
    isAgeApproved,
    ageEstimation: Math.floor(result.age.age),
    agePredictionResult: result.antispoofing.prediction,
  })
}

@Injectable()
export class UserService {
  googleApiKey = process.env.GOOGLE_API_KEY

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private algoliaService: AlgoliaService,
    private schoolService: SchoolService,
    private pushNotificationService: PushNotificationService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @Inject(forwardRef(() => TagService))
    private tagService: TagService
  ) {}

  async trackUserView(userId: string): Promise<boolean> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { viewsCount: { increment: 1 } },
    })

    return true
  }

  // async getUserLocale(userId: string): Promise<string> {
  //   const user = await this.prismaService.user.findUnique({
  //     where: { id: userId },
  //     select: {
  //       locale: true,
  //     },
  //   })

  //   if (!user) return Promise.reject(new Error('USER not found'))

  //   return user.locale ? user.locale.split('-')[0] : 'en'
  // }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    })
  }

  async getUser(userId: string): Promise<User> {
    return this.getUserCore({ id: userId })
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.getUserCore({ phoneNumber })
  }

  async getUserCore(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const res = await this.prismaService.user.findUnique({
      where,
      select: {
        id: true,
        createdAt: true,
        displayName: true,
        username: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        snapchat: true,
        tiktok: true,
        isBanned: true,
        isAgeApproved: true,
        school: {
          select: {
            id: true,
            name: true,
            city: {
              select: {
                id: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
        countryId: true,
        training: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            posts: true,
            tags: true,
            followers: true,
            followees: true,
          },
        },
        viewsCount: true,
      },
    })

    if (!res) return Promise.reject(new Error('not found'))

    const { _count, ...user } = res

    return {
      ...user,
      followersCount: _count.followers,
      followeesCount: _count.followees,
      postCount: _count.posts,
      tagCount: _count.tags,
    }
  }

  async getUsers(userIds: string[]): Promise<PaginatedUsers> {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        createdAt: true,
        displayName: true,
        username: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        snapchat: true,
        tiktok: true,
        school: {
          select: {
            id: true,
            name: true,
            city: {
              select: {
                id: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
        training: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            posts: true,
            tags: true,
            followers: true,
            followees: true,
          },
        },
        viewsCount: true,
      },
    })

    const items = users.map(({ _count, ...user }) => ({
      ...user,
      followersCount: _count.followers,
      followeesCount: _count.followees,
      postCount: _count.posts,
      tagCount: _count.tags,
    }))

    return {
      items,
    }
  }

  // async getCommonFriendsCountMultiUser(authUser: AuthUser, otherUserIds: string[]) {
  //   const users = await this.prismaService.user.findMany({
  //     where: {
  //       id: {
  //         in: otherUserIds,
  //       },
  //       friends: {
  //         some: {
  //           otherUser: {
  //             friends: {
  //               some: {
  //                 otherUserId: authUser.id,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     select: {
  //       id: true,
  //       _count: {
  //         select: {
  //           friends: true,
  //         },
  //       },
  //     },
  //   })

  //   return users.map((u) => ({ otherUserId: u.id, count: u._count.friends }))
  // }

  // getCommonFriendsCount(authUser: AuthUser, otherUserId: string): Promise<number> {
  //   return this.prismaService.user.count({
  //     where: {
  //       AND: [
  //         {
  //           friends: {
  //             some: {
  //               otherUserId: authUser.id,
  //             },
  //           },
  //         },
  //         {
  //           friends: {
  //             some: {
  //               otherUserId,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   })
  // }

  // async getCommonFriends(
  //   authUser: AuthUser,
  //   otherUserId: string,
  //   skip: number,
  //   limit: number
  // ): Promise<PaginatedUsers> {
  //   const where = {
  //     AND: [
  //       {
  //         friends: {
  //           some: {
  //             otherUserId: authUser.id,
  //           },
  //         },
  //       },
  //       {
  //         friends: {
  //           some: {
  //             otherUserId,
  //           },
  //         },
  //       },
  //     ],
  //   }

  //   const [totalCount, items] = await Promise.all([
  //     this.prismaService.user.count({
  //       where,
  //     }),
  //     this.prismaService.user.findMany({
  //       take: limit,
  //       skip,
  //       where,
  //       include: {
  //         school: true,
  //       },
  //     }),
  //   ])

  //   const nextSkip = skip + limit

  //   return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  // }

  // async getCommonFriendsMultiUser(
  //   authUser: AuthUser,
  //   otherUserIds: string[],
  //   skip: number,
  //   limit: number
  // ): Promise<
  //   {
  //     otherUserId: string
  //     commonFriends: PaginatedUsers
  //   }[]
  // > {
  //   const where = {
  //     AND: [
  //       {
  //         friends: {
  //           some: {
  //             otherUserId: authUser.id,
  //           },
  //         },
  //       },
  //       {
  //         friends: {
  //           some: {
  //             otherUserId: {
  //               in: otherUserIds,
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   }

  //   const [totalCount, users] = await Promise.all([
  //     this.prismaService.user.count({
  //       where,
  //     }),
  //     this.prismaService.user.findMany({
  //       where,
  //       select: {
  //         id: true,
  //         friends: {
  //           take: limit,
  //           skip,
  //           select: {
  //             user: true,
  //           },
  //         },
  //       },
  //     }),
  //   ])

  //   const nextSkip = skip + limit

  //   const res = otherUserIds.map((otherUserId) => {
  //     const u = users.find(({ id }) => id === otherUserId)

  //     if (!u)
  //       return {
  //         otherUserId,
  //         commonFriends: {
  //           items: [],
  //           nextSkip: 0,
  //         },
  //       }

  //     return {
  //       otherUserId,
  //       commonFriends: {
  //         items: u.friends.map(({ user }) => user),
  //         nextSkip: totalCount > nextSkip ? nextSkip : 0,
  //       },
  //     }
  //   })

  //   return res
  // }

  async getFollowers(userId: string, skip: number, limit: number): Promise<PaginatedUsers> {
    const [totalCount, follows] = await Promise.all([
      this.prismaService.follower.count({
        where: {
          followeeId: userId,
        },
      }),
      this.prismaService.follower.findMany({
        take: limit,
        skip,
        where: {
          followeeId: userId,
        },
        include: {
          user: {
            include: {
              school: true,
              training: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    const items = follows.map(({ user }) => user)

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : null }
  }

  async getFollowees(
    userId: string,
    skip: number,
    limit: number,
    displayNameStartsWith?: string,
    sortBy?: UserFolloweesSortBy,
    sortDirection?: SortDirection
  ): Promise<PaginatedUsers> {
    console.log({ sortBy })
    const where: Prisma.FollowerWhereInput = {
      userId,
      ...(displayNameStartsWith && {
        followee: {
          displayName: {
            startsWith: displayNameStartsWith,
            mode: 'insensitive',
          },
        },
      }),
    }

    const [totalCount, follows] = await Promise.all([
      this.prismaService.follower.count({
        where,
      }),
      this.prismaService.follower.findMany({
        take: limit,
        skip,
        where,
        include: {
          followee: {
            include: {
              school: true,
              training: true,
            },
          },
        },
        orderBy: getUserFolloweesSort(sortBy, sortDirection),
      }),
    ])

    console.log({ ad: getUserFolloweesSort(sortBy, sortDirection) })

    const items = follows.map(({ followee }) => followee)

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : null }
  }

  async getTagViewsCount(userId: string): Promise<number> {
    const user = await this.prismaService.tag.aggregate({
      where: {
        authorId: userId,
      },
      _sum: {
        viewsCount: true,
      },
    })

    return user._sum.viewsCount || 0
  }

  async isFollowedByUser(followeeId: string, userId: string): Promise<boolean> {
    const follow = await this.prismaService.follower.findUnique({
      where: {
        userId_followeeId: {
          followeeId,
          userId,
        },
      },
    })

    return !!follow
  }

  async isBlockedByUser(userId: string, otherUserId: string): Promise<boolean> {
    const blockedUsers = await this.prismaService.user
      .findUnique({
        where: {
          id: otherUserId,
        },
      })
      .blockedUsers({
        where: {
          id: userId,
        },
      })

    return blockedUsers.length > 0
  }

  async findMe(userId: string): Promise<Me> {
    const res = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        role: true,
        email: true,
        displayName: true,
        username: true,
        pictureId: true,
        birthdate: true,
        about: true,
        isFilled: true,
        isAgeApproved: true,
        expoPushNotificationTokens: true,
        instagram: true,
        snapchat: true,
        tiktok: true,
        school: {
          select: {
            id: true,
            name: true,
            googlePlaceId: true,
            lat: true,
            lng: true,
            city: {
              select: {
                id: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
        countryId: true,
        training: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            followers: true,
            followees: true,
            posts: true,
            tags: true,
          },
        },
        viewsCount: true,
      },
    })

    if (!res) return Promise.reject(new Error('not found'))

    const { expoPushNotificationTokens, _count, ...user } = res

    return {
      ...user,
      expoPushNotificationTokens: expoPushNotificationTokens.map(({ token }) => token),
      followersCount: _count.followers,
      followeesCount: _count.followees,
      postCount: _count.posts,
      tagCount: _count.tags,
    }
  }

  async requestResetPassword(email: string): Promise<boolean> {
    await this.findByEmail(email)

    const resetToken = this.generateResetToken()

    await this.prismaService.user.update({
      data: {
        resetToken,
      },
      where: {
        email,
      },
    })

    this.emailService.sendForgottenPasswordEmail(email, resetToken)

    return true
  }

  async resetPassword(password: string, resetToken: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        resetToken,
      },
      select: {
        id: true,
      },
    })

    if (!user) return Promise.reject(new Error('not found'))

    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)

    const userUpdated = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hash,
        resetToken: null,
      },
    })

    if (!userUpdated) return Promise.reject(new Error('not found'))

    return user
  }

  private generateResetToken() {
    return randomBytes(25).toString('hex')
  }

  async delete(userId: string): Promise<boolean> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      await this.prismaService.user.delete({ where: { id: userId } })
      const algoliaUserIndex = this.algoliaService.initIndex('USERS')

      await this.algoliaService.deleteObject(algoliaUserIndex, userId).catch(console.error)

      return true
    } catch (e) {
      console.log(e)
      return Promise.reject(new Error('not found'))
    }
  }

  async ban(userId: string): Promise<boolean> {
    await this.prismaService.user.update({ where: { id: userId }, data: { isActive: false, isBanned: true } })

    const algoliaUserIndex = this.algoliaService.initIndex('USERS')

    this.algoliaService.deleteObject(algoliaUserIndex, userId)

    return true
  }

  async approveAge(authUser: AuthUser, userId: string): Promise<boolean> {
    await this.prismaService.user.update({ where: { id: userId }, data: { isAgeApproved: true } })

    return true
  }

  async report(authUser: AuthUser, otherUserId: string): Promise<boolean> {
    await this.prismaService.userReport.create({
      data: { authorId: authUser.id, userId: otherUserId },
    })

    return true
  }

  async block(authUser: AuthUser, otherUserId: string): Promise<boolean> {
    await Promise.all([
      this.prismaService.user.update({
        where: { id: authUser.id },
        data: {
          blockedUsers: {
            connect: {
              id: otherUserId,
            },
          },
        },
      }),
      this.prismaService.follower.deleteMany({
        where: {
          userId: authUser.id,
          followeeId: otherUserId,
        },
      }),
      this.prismaService.follower.deleteMany({
        where: {
          userId: otherUserId,
          followeeId: authUser.id,
        },
      }),
    ])

    return true
  }

  async unBlock(authUser: AuthUser, otherUserId: string): Promise<boolean> {
    await this.prismaService.user.update({
      where: { id: authUser.id },
      data: {
        blockedUsers: {
          disconnect: {
            id: otherUserId,
          },
        },
      },
    })

    return true
  }

  async follow(userId: string, followeeId: string, shouldNotify: boolean = false): Promise<boolean> {
    if (userId === followeeId) {
      return false
    }

    const [isBlockerByUser, hasBlockedUser, isAlreadyFollowed] = await Promise.all([
      this.isBlockedByUser(followeeId, userId),
      this.isBlockedByUser(userId, followeeId),
      this.isFollowedByUser(followeeId, userId),
    ])

    if (isBlockerByUser || hasBlockedUser) return Promise.reject(new Error('User is blocked'))

    if (isAlreadyFollowed) {
      return true
    }

    const follower = await this.prismaService.follower.create({
      data: {
        userId,
        followeeId,
      },
    })

    if (shouldNotify) {
      this.prismaService.notification.create({
        data: {
          userId: followeeId,
          followerUserId: userId,
          type: NotificationType.IS_NOW_FOLLOWING_YOU,
        },
      })
      this.pushNotificationService.isNowFollowingYou(follower)
    }

    return true
  }

  async unFollow(userId: string, followeeId: string): Promise<boolean> {
    await this.prismaService.follower.delete({
      where: {
        userId_followeeId: {
          userId,
          followeeId,
        },
      },
    })

    return true
  }

  async syncUsersIndexWithAlgolia(userId: string): Promise<PartialUpdateObjectResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: algoliaUserSelect,
    })

    if (!user) return Promise.reject(new Error('No user'))

    const usersIndex = this.algoliaService.initIndex('USERS')

    const newUserAlgoliaObject = mapAlgoliaUser(user)

    return this.algoliaService.partialUpdateObject(usersIndex, newUserAlgoliaObject, user.id)
  }

  async syncPostsIndexWithAlgolia(userId: string): Promise<(PartialUpdateObjectResponse | undefined)[]> {
    const posts = await this.prismaService.post.findMany({ where: { authorId: userId }, select: { id: true } })

    return Promise.all(posts.map((post) => this.postService.syncPostIndexWithAlgolia(post.id)))
  }

  async getFollowSuggestions(authUser: AuthUser, skip: number, limit: number): Promise<PaginatedUsers> {
    if (!authUser.schoolId) return Promise.reject(new Error('No school'))

    const where: Prisma.UserWhereInput = {
      schoolId: authUser.schoolId,
      NOT: {
        id: authUser.id,
        followers: {
          some: {
            userId: authUser.id,
          },
        },
      },
      id: {
        not: authUser.id,
      },
    }

    const [totalCount, items] = await Promise.all([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        take: limit,
        skip,
        where,
        include: {
          school: true,
          training: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : null, totalCount }
  }

  async findOrCreate(phoneNumber: string, locale: string): Promise<{ user: User; isNewUser?: boolean }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
    })

    if (user) return { user }

    const newUser = await this.prismaService.user.create({
      data: {
        phoneNumber,
        locale,
      },
    })

    return { user: newUser, isNewUser: true }
  }

  async update(userId: string, data: UpdateUserInput): Promise<Me> {
    const schoolData = data.schoolGooglePlaceId && (await this.schoolService.getOrCreate(data.schoolGooglePlaceId))
    const country =
      data.countryCode && (await this.prismaService.country.findUnique({ where: { code: data.countryCode } }))

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        role: true,
        isFilled: true,
        isAgeApproved: true,
        email: true,
        displayName: true,
        username: true,
        pictureId: true,
        birthdate: true,
        instagram: true,
        snapchat: true,
        tiktok: true,
        about: true,
        countryId: true,
        school: {
          select: {
            id: true,
            name: true,
            city: {
              select: {
                id: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
        training: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      data: {
        displayName: data.displayName,
        username: data.username,
        email: data.email,
        password: data.password,
        birthdate: data.birthdate,
        snapchat: data.snapchat,
        instagram: data.instagram,
        tiktok: data.tiktok,
        pictureId: data.pictureId,
        about: data.about,
        isFilled: data.isFilled,
        ...(schoolData && {
          school: {
            connect: {
              id: schoolData.id,
            },
          },
          country: {
            connect: {
              id: schoolData.city.countryId,
            },
          },
        }),
        ...(data.schoolGooglePlaceId === null && {
          school: { disconnect: true },
        }),
        ...(country && {
          country: {
            connect: {
              id: country.id,
            },
          },
        }),
        ...(data.trainingName && {
          training: {
            connectOrCreate: {
              where: {
                name: data.trainingName,
              },
              create: {
                name: data.trainingName,
              },
            },
          },
        }),
        ...(data.trainingName === null && {
          training: { disconnect: true },
        }),
      },
    })

    if (!updatedUser) return Promise.reject(new Error('not found'))

    if (data.isFilled) {
      // eslint-disable-next-line functional/no-try-statement
      try {
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }

      // eslint-disable-next-line functional/no-try-statement
      try {
        this.syncUsersIndexWithAlgolia(userId)
        this.syncPostsIndexWithAlgolia(userId)
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }
    } else if (updatedUser.isFilled) {
      this.syncUsersIndexWithAlgolia(userId)

      // await this.neo4jService.user.update({
      //   where: { id: userId },
      //   update: {
      //     displayName: updatedUser.displayName,
      //     username: updatedUser.username,
      //     pictureId: updatedUser.pictureId,
      //   },
      // })
    }

    if (schoolData) {
      this.schoolService.syncAlgoliaSchool(schoolData.id)

      const previousSchool =
        schoolData &&
        (await this.prismaService.user.findUnique({
          where: { id: userId },
        }))

      if (previousSchool?.schoolId && previousSchool.schoolId !== schoolData.id) {
        this.schoolService.syncAlgoliaSchool(previousSchool.schoolId)
      }
    }

    return updatedUser
  }

  async updateAgeVerification(authUser: AuthUser, facePictureId: string): Promise<AgeVerificationResult> {
    const { isAgeApproved, ageEstimation, agePredictionResult } = await checkAge(facePictureId)

    deleteObject(facePictureId)

    await this.prismaService.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        isAgeApproved,
        ageEstimation,
        agePredictionResult,
      },
    })

    if (authUser.isAdmin) {
      return {
        isAgeApproved,
        ageEstimation,
        agePredictionResult,
      }
    } else {
      return {
        isAgeApproved,
      }
    }
  }

  async getIsUsernameAvailable(username: string): Promise<boolean> {
    const count = await this.prismaService.user.count({
      where: {
        username,
      },
    })

    return count < 1
  }
}
