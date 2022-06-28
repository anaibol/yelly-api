import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { AlgoliaService } from '../core/algolia.service'
// import { Neo4jService } from './../core/neo4j.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SendbirdService } from '../sendbird/sendbird.service'
import { SchoolService } from '../school/school.service'
import { UpdateUserInput } from './update-user.input'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { User } from './user.model'
import { PushNotificationService } from 'src/core/push-notification.service'
import { Me } from './me.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { FollowRequest } from './follow-request.model'
import { SendbirdAccessToken } from './sendbirdAccessToken'
import { AuthUser } from 'src/auth/auth.service'
import { PostService } from 'src/post/post.service'
import { Prisma } from '@prisma/client'
import { PartialUpdateObjectResponse } from '@algolia/client-search'
import { RequestBuilder, Payload } from 'yoti'

// const yotiClient = new yoti.Client(process.env.CLIENT_SDK_ID, process.env.PEM_KEY)

type AgeVerificationResult = {
  isAgeApproved: boolean
  ageEstimation: number
  agePredictionResult: null | 'real' | 'fake' | 'undetermined'
}

const checkAge = (pictureId: string): Promise<AgeVerificationResult> => {
  const data = {
    // pictureId base64 encoded
    data: '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',
  }

  // const request = new RequestBuilder()
  //   .withBaseUrl('https://api.yoti.com/api/v1/age-verification')
  //   .withPemFilePath('<YOTI_KEY_FILE_PATH>')
  //   .withEndpoint('/checks')
  //   .withPayload(new Payload(data))
  //   .withMethod('POST')
  //   .withHeader('X-Yoti-Auth-Id', process.env.CLIENT_SDK_ID)
  //   .build()
  // //get Yoti response
  // const response = request.execute()

  // Example response
  // {
  //   "pred_age": 29.7475,
  //   "uncertainty": 2.04677
  // }

  return Promise.resolve({
    isAgeApproved: true,
    ageEstimation: 20,
    agePredictionResult: 'real',
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
    private sendbirdService: SendbirdService,
    private pushNotificationService: PushNotificationService,
    // private neo4jService: Neo4jService,
    private postService: PostService
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

  async hasUserPostedOnTag(userId: string, tagId: string): Promise<boolean> {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        author: {
          id: userId,
        },
        tags: {
          some: {
            id: tagId,
          },
        },
      },
    })

    return post != null
  }

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
    const res = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        snapchat: true,
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
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        snapchat: true,
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
            },
          },
        },
      }),
    ])

    const items = follows.map(({ user }) => user)

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  async getFollowees(userId: string, skip: number, limit: number): Promise<PaginatedUsers> {
    const [totalCount, follows] = await Promise.all([
      this.prismaService.follower.count({
        where: {
          userId,
        },
      }),
      this.prismaService.follower.findMany({
        take: limit,
        skip,
        where: {
          userId,
        },
        include: {
          followee: {
            include: {
              school: true,
            },
          },
        },
      }),
    ])

    const items = follows.map(({ followee }) => followee)

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
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

  async getPendingFollowRequest(requesterId: string, toFollowUserId: string): Promise<FollowRequest | null> {
    return this.prismaService.followRequest.findFirst({
      select: {
        id: true,
        status: true,
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pictureId: true,
          },
        },
      },
      where: {
        requesterId,
        toFollowUserId,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
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
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        isFilled: true,
        isAgeApproved: true,
        sendbirdAccessToken: true,
        expoPushNotificationTokens: true,
        instagram: true,
        snapchat: true,
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

  async refreshSendbirdAccessToken(userId: string): Promise<SendbirdAccessToken> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      const sendbirdAccessToken = await this.sendbirdService.getAccessToken(userId)

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          sendbirdAccessToken,
        },
      })

      return { sendbirdAccessToken }
    } catch {
      return Promise.reject(new Error('Sendbird error'))
    }
  }

  private generateResetToken() {
    return randomBytes(25).toString('hex')
  }

  async delete(userId: string): Promise<boolean> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      await this.prismaService.user.delete({ where: { id: userId } })
      const algoliaUserIndex = this.algoliaService.initIndex('USERS')

      this.algoliaService.deleteObject(algoliaUserIndex, userId).catch(console.error)
      this.sendbirdService.deleteUser(userId).catch(console.error)

      return true
    } catch {
      return Promise.reject(new Error('not found'))
    }
  }

  async ban(userId: string): Promise<boolean> {
    await this.prismaService.user.update({ where: { id: userId }, data: { isActive: false, isBanned: true } })

    const algoliaUserIndex = this.algoliaService.initIndex('USERS')

    this.algoliaService.deleteObject(algoliaUserIndex, userId)
    // this.sendbirdService.deactivateUser(userId)

    return true
  }

  async createFollowRequest(authUser: AuthUser, otherUserId: string): Promise<FollowRequest> {
    if (authUser.id === otherUserId) return Promise.reject(new Error('AuthUserId and OtherUserId cant be equal'))

    const existingFollowRequest = await this.prismaService.followRequest.findFirst({
      where: {
        requesterId: authUser.id,
        toFollowUserId: authUser.id,
        status: 'PENDING',
      },
    })

    if (existingFollowRequest) return Promise.reject(new Error('Follow requests already exists'))

    const followRequest = await this.prismaService.followRequest.create({
      data: {
        requester: {
          connect: {
            id: authUser.id,
          },
        },
        toFollowUser: {
          connect: {
            id: otherUserId,
          },
        },
        notifications: {
          create: {
            type: 'FOLLOW_REQUEST_PENDING',
            userId: otherUserId,
          },
        },
      },
    })

    this.pushNotificationService.createFollowRequestPushNotification(followRequest)

    return followRequest
  }

  async deleteFollowRequest(authUser: AuthUser, followRequestId: string): Promise<boolean> {
    const exists = await this.prismaService.user
      .findUnique({
        where: {
          id: authUser.id,
        },
      })
      .followRequestRequester({
        where: {
          id: followRequestId,
        },
      })

    if (!exists) return Promise.reject(new Error("Follow request doesn't exists or is not from this user"))

    await Promise.all([
      this.prismaService.followRequest.delete({
        where: {
          id: followRequestId,
        },
      }),
      this.prismaService.notification.deleteMany({
        where: {
          followRequestId,
        },
      }),
    ])

    return true
  }

  async declineFollowRequest(authUser: AuthUser, followRequestId: string): Promise<boolean> {
    const exists = await this.prismaService.followRequest.findFirst({
      where: {
        id: followRequestId,
        toFollowUserId: authUser.id,
      },
    })

    if (!exists) return false

    await this.prismaService.$transaction([
      this.prismaService.notification.deleteMany({
        where: {
          followRequestId,
        },
      }),
      this.prismaService.followRequest.update({
        where: {
          id: followRequestId,
        },
        data: {
          status: 'DECLINED',
        },
      }),
    ])

    return true
  }

  async acceptFollowRequest(authUser: AuthUser, followRequestId: string): Promise<boolean> {
    const followRequest = await this.prismaService.followRequest.findUnique({
      where: {
        id: followRequestId,
      },
    })

    if (followRequest?.toFollowUserId !== authUser.id) return Promise.reject(new Error('No follow request'))

    const { requesterId, toFollowUserId } = followRequest

    await this.prismaService.$transaction([
      this.prismaService.follower.create({
        data: {
          userId: requesterId,
          followeeId: toFollowUserId,
        },
      }),
      this.prismaService.followRequest.update({
        where: {
          id: followRequestId,
        },
        data: {
          status: 'ACCEPTED',
        },
      }),
      this.prismaService.notification.updateMany({
        where: {
          userId: toFollowUserId,
          followRequestId,
        },
        data: {
          type: 'FOLLOW_REQUEST_ACCEPTED',
        },
      }),
      this.prismaService.notification.create({
        data: {
          userId: requesterId,
          followRequestId,
          type: 'FOLLOW_REQUEST_ACCEPTED',
        },
      }),
    ])

    this.pushNotificationService.createFollowRequestAcceptedPushNotification(followRequest)

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

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0, totalCount }
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
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        instagram: true,
        snapchat: true,
        about: true,
        sendbirdAccessToken: true,
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        birthdate: data.birthdate,
        instagram: data.instagram,
        snapchat: data.snapchat,
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
      },
    })

    if (!updatedUser) return Promise.reject(new Error('not found'))

    if (data.isFilled) {
      // eslint-disable-next-line functional/no-try-statement
      try {
        // const sendbirdAccessToken = updatedUser && (await this.sendbirdService.createUser(updatedUser))
        // await this.prismaService.user.update({
        //   where: {
        //     id: userId,
        //   },
        //   data: {
        //     sendbirdAccessToken,
        //   },
        // })
        // eslint-disable-next-line functional/immutable-data
        // updatedUser.sendbirdAccessToken = sendbirdAccessToken
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }

      // eslint-disable-next-line functional/no-try-statement
      try {
        this.syncUsersIndexWithAlgolia(userId)
        this.syncPostsIndexWithAlgolia(userId)

        // await this.neo4jService.user.create({
        //   input: [
        //     {
        //       id: updatedUser.id,
        //       firstName: updatedUser.firstName,
        //       lastName: updatedUser.lastName,
        //       pictureId: updatedUser.pictureId,
        //     },
        //   ],
        // })
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }
    } else if (updatedUser.isFilled) {
      // eslint-disable-next-line functional/no-try-statement
      try {
        // await this.updateSenbirdUser(updatedUser)
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }

      this.syncUsersIndexWithAlgolia(userId)

      // await this.neo4jService.user.update({
      //   where: { id: userId },
      //   update: {
      //     firstName: updatedUser.firstName,
      //     lastName: updatedUser.lastName,
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

  async updateAgeVerification(authUser: AuthUser, facePictureId: string): Promise<boolean> {
    await this.prismaService.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        facePictureId,
      },
    })

    const data = await checkAge(facePictureId)

    await this.prismaService.user.update({
      where: {
        id: authUser.id,
      },
      data,
    })

    return true
  }
}
