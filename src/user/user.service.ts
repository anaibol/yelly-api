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
import { FollowRequest } from './followRequest.model'
import { SendbirdAccessToken } from './sendbirdAccessToken'
import { AuthUser } from 'src/auth/auth.service'
import { PostService } from 'src/post/post.service'
import { Prisma } from '@prisma/client'
import { PartialUpdateObjectResponse } from '@algolia/client-search'

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

  async findOne(userId: string): Promise<User> {
    const res = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        avatar3dId: true,
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
          },
        },
      },
    })

    if (!res) return Promise.reject(new Error('not found'))

    const { _count, ...user } = res

    return {
      ...user,
      postCount: _count.posts,
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

  //   const [totalCount, items] = await this.prismaService.$transaction([
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
    const [totalCount, follows] = await this.prismaService.$transaction([
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
    const [totalCount, follows] = await this.prismaService.$transaction([
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

  async areFollowedByUser(
    followeesIds: string[],
    userId: string
  ): Promise<
    {
      followeeId: string
      isFollowedByAuthUser: boolean
    }[]
  > {
    if (followeesIds.length === 1) {
      const [followeeId] = followeesIds

      const follow = await this.prismaService.follower.findUnique({
        where: {
          userId_followeeId: {
            followeeId,
            userId,
          },
        },
      })

      return [{ followeeId, isFollowedByAuthUser: !!follow }]
    }

    const follows = await this.prismaService.follower.findMany({
      where: {
        userId,
        followeeId: {
          in: followeesIds as string[],
        },
      },
    })

    return followeesIds.map((followeeId) => ({
      followeeId,
      isFollowedByAuthUser: follows.map(({ followeeId }) => followeeId).includes(followeeId),
    }))
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
        role: true,
        email: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        avatar3dId: true,
        birthdate: true,
        about: true,
        isFilled: true,
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
    this.sendbirdService.deactivateUser(userId)

    return true
  }

  async createFollowRequest(authUser: AuthUser, otherUserId: string): Promise<FollowRequest> {
    // eslint-disable-next-line functional/no-throw-statement
    if (authUser.id === otherUserId) throw new Error('AuthUserId and OtherUserId cant be equal')

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
    // eslint-disable-next-line functional/no-throw-statement
    if (!authUser.schoolId) throw new Error('No school')

    const where: Prisma.UserWhereInput = {
      schoolId: authUser.schoolId,
      NOT: {
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

    if (totalCount) {
      return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0, totalCount }
    } else {
      const authUserBirthYear = authUser.birthdate?.getFullYear()

      const where: Prisma.UserWhereInput = {
        birthdate: {
          gte: new Date(`01/01/${authUserBirthYear}`),
          lt: new Date(`12/31/${authUserBirthYear}`),
        },
        NOT: {
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

      return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0, totalCount }
    }
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
    console.log({ data })
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        isFilled: true,
        email: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        avatar3dId: true,
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
        avatar3dId: data.avatar3dId,
        about: data.about,
        isFilled: data.isFilled,
        ...(schoolData && {
          school: {
            connect: {
              id: schoolData.id,
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
        const sendbirdAccessToken = updatedUser && (await this.sendbirdService.createUser(updatedUser))

        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            sendbirdAccessToken,
          },
        })

        // eslint-disable-next-line functional/immutable-data
        updatedUser.sendbirdAccessToken = sendbirdAccessToken
      } catch (error) {
        console.log(33)

        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }

      console.log(12333)

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
        await this.updateSenbirdUser(updatedUser)
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

  async updateSenbirdUser(user: User): Promise<void> {
    if (user.firstName || user.lastName || user.pictureId) {
      await this.sendbirdService.updateUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureId: user.pictureId,
      })
    }
  }
}
