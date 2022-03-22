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
import { FriendRequest } from './friendRequest.model'
import { SendbirdAccessToken } from './sendbirdAccessToken'
import { AuthUser } from 'src/auth/auth.service'
import { PostService } from 'src/post/post.service'

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
    const user = await this.prismaService.user.findUnique({
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
      },
    })

    if (!user) return Promise.reject(new Error('not found'))

    return user
  }

  getFriendsCount(userId: string): Promise<number> {
    return this.prismaService.friend.count({
      where: {
        userId,
      },
    })
  }

  async getCommonFriendsCountMultiUser(authUser: AuthUser, otherUserIds: string[]) {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: otherUserIds,
        },
        friends: {
          some: {
            otherUser: {
              friends: {
                some: {
                  otherUserId: authUser.id,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        _count: {
          select: {
            friends: true,
          },
        },
      },
    })

    return users.map((u) => ({ otherUserId: u.id, count: u._count.friends }))
  }

  getCommonFriendsCount(authUser: AuthUser, otherUserId: string): Promise<number> {
    return this.prismaService.user.count({
      where: {
        AND: [
          {
            friends: {
              some: {
                otherUserId: authUser.id,
              },
            },
          },
          {
            friends: {
              some: {
                otherUserId,
              },
            },
          },
        ],
      },
    })
  }

  async getCommonFriends(
    authUser: AuthUser,
    otherUserId: string,
    skip: number,
    limit: number
  ): Promise<PaginatedUsers> {
    const where = {
      AND: [
        {
          friends: {
            some: {
              otherUserId: authUser.id,
            },
          },
        },
        {
          friends: {
            some: {
              otherUserId,
            },
          },
        },
      ],
    }

    const [totalCount, items] = await this.prismaService.$transaction([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        take: limit,
        skip,
        where,
      }),
    ])

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  async getCommonFriendsMultiUser(
    authUser: AuthUser,
    otherUserIds: string[],
    skip: number,
    limit: number
  ): Promise<
    {
      otherUserId: string
      commonFriends: PaginatedUsers
    }[]
  > {
    const where = {
      AND: [
        {
          friends: {
            some: {
              otherUserId: authUser.id,
            },
          },
        },
        {
          friends: {
            some: {
              otherUserId: {
                in: otherUserIds,
              },
            },
          },
        },
      ],
    }

    const [totalCount, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          friends: {
            take: limit,
            skip,
            select: {
              user: true,
            },
          },
        },
      }),
    ])

    const nextSkip = skip + limit

    const res = otherUserIds.map((otherUserId) => {
      const u = users.find(({ id }) => id === otherUserId)

      if (!u)
        return {
          otherUserId,
          commonFriends: {
            items: [],
            nextSkip: 0,
          },
        }

      return {
        otherUserId,
        commonFriends: {
          items: u.friends.map(({ user }) => user),
          nextSkip: totalCount > nextSkip ? nextSkip : 0,
        },
      }
    })

    return res
  }

  async getFriends(userId: string, skip: number, limit: number): Promise<PaginatedUsers> {
    const where = {
      friends: {
        some: {
          otherUserId: userId,
        },
      },
    }

    const [totalCount, items] = await this.prismaService.$transaction([
      this.prismaService.user.count({
        where,
      }),
      this.prismaService.user.findMany({
        take: limit,
        skip,
        where,
      }),
    ])

    if (!items.length)
      return {
        items: [],
        nextSkip: 0,
      }

    const nextSkip = skip + limit

    return { items, nextSkip: totalCount > nextSkip ? nextSkip : 0 }
  }

  async isFriend(
    userId: string,
    otherUserIds: string[]
  ): Promise<
    {
      otherUserId: string
      isFriend: boolean
    }[]
  > {
    if (otherUserIds.length === 1) {
      const [otherUserId] = otherUserIds

      const friend = await this.prismaService.friend.findUnique({
        where: {
          userId_otherUserId: {
            userId,
            otherUserId: otherUserId,
          },
        },
      })

      return [{ otherUserId, isFriend: !!friend }]
    }

    const friends = await this.prismaService.friend.findMany({
      where: {
        userId,
        otherUserId: {
          in: otherUserIds as string[],
        },
      },
    })

    return otherUserIds.map((otherUserId) => ({
      otherUserId,
      isFriend: friends.map(({ otherUserId }) => otherUserId).includes(otherUserId),
    }))
  }

  async getFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest | null> {
    return this.prismaService.friendRequest.findFirst({
      select: {
        id: true,
        status: true,
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pictureId: true,
          },
        },
      },
      where: {
        fromUserId,
        toUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findMe(userId: string): Promise<Me> {
    const user = await this.prismaService.user.findUnique({
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
      },
    })

    if (!user) return Promise.reject(new Error('not found'))

    return {
      ...user,
      expoPushNotificationTokens: user.expoPushNotificationTokens.map(({ token }) => token),
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

      this.algoliaService.deleteObject(algoliaUserIndex, userId)
      this.sendbirdService.deleteUser(userId)

      return true
    } catch {
      return Promise.reject(new Error('not found'))
    }
  }

  async deactivate(userId: string): Promise<boolean> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      await this.prismaService.user.update({ where: { id: userId }, data: { isActive: false } })
      const algoliaUserIndex = this.algoliaService.initIndex('USERS')

      this.algoliaService.deleteObject(algoliaUserIndex, userId)
      this.sendbirdService.deleteUser(userId)

      return true
    } catch {
      return Promise.reject(new Error('not found'))
    }
  }

  async ban(userId: string): Promise<boolean> {
    // eslint-disable-next-line functional/no-try-statement
    try {
      await this.prismaService.user.update({ where: { id: userId }, data: { isActive: false, isBanned: true } })
      const algoliaUserIndex = this.algoliaService.initIndex('USERS')

      this.algoliaService.deleteObject(algoliaUserIndex, userId)
      this.sendbirdService.deleteUser(userId)

      return true
    } catch {
      return Promise.reject(new Error('not found'))
    }
  }

  async createFriendRequest(authUser: AuthUser, otherUserId: string): Promise<FriendRequest> {
    const friendRequest = await this.prismaService.friendRequest.create({
      data: {
        fromUser: {
          connect: {
            id: authUser.id,
          },
        },
        toUser: {
          connect: {
            id: otherUserId,
          },
        },
        notifications: {
          create: {
            userId: otherUserId,
          },
        },
      },
    })

    this.pushNotificationService.createFriendRequestPushNotification(friendRequest)

    return friendRequest
  }

  async deleteFriendRequest(authUser: AuthUser, friendRequestId: string): Promise<boolean> {
    const exists = await this.prismaService.user
      .findUnique({
        where: {
          id: authUser.id,
        },
      })
      .friendRequestFromUser({
        where: {
          id: friendRequestId,
        },
      })

    if (!exists) return Promise.reject(new Error("Friend request doesn't exists or is not from this user"))

    await Promise.all([
      this.prismaService.notification.deleteMany({
        where: {
          friendRequestId,
        },
      }),
    ])

    return true
  }

  async declineFriendRequest(authUser: AuthUser, friendRequestId: string): Promise<boolean> {
    const exists = await this.prismaService.friendRequest.findFirst({
      where: {
        id: friendRequestId,
        toUserId: authUser.id,
      },
    })

    if (!exists) return false

    await Promise.all([
      this.prismaService.notification.deleteMany({
        where: {
          friendRequestId,
        },
      }),
      this.prismaService.friendRequest.update({
        where: {
          id: friendRequestId,
        },
        data: {
          status: 'DECLINED',
        },
      }),
    ])

    return true
  }

  async acceptFriendRequest(authUser: AuthUser, friendRequestId: string): Promise<boolean> {
    const friendRequest = await this.prismaService.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    })

    if (friendRequest?.toUserId !== authUser.id) return Promise.reject(new Error('No friend request'))

    const { fromUserId, toUserId } = friendRequest

    await this.prismaService.$transaction([
      this.prismaService.friend.createMany({
        data: [
          {
            userId: fromUserId,
            otherUserId: toUserId,
          },
          {
            userId: toUserId,
            otherUserId: fromUserId,
          },
        ],
      }),
      this.prismaService.friendRequest.update({
        where: {
          id: friendRequestId,
        },
        data: {
          status: 'ACCEPTED',
        },
      }),
      this.prismaService.notification.create({
        data: {
          userId: fromUserId,
          friendRequestId,
        },
      }),
    ])

    this.pushNotificationService.createFriendRequestAcceptedPushNotification(friendRequest)

    return true
  }

  async unfriend(userId: string, otherUserId: string): Promise<boolean> {
    await this.prismaService.friend.deleteMany({
      where: {
        OR: [
          {
            userId: userId,
            otherUserId: otherUserId,
          },
          {
            userId: otherUserId,
            otherUserId: userId,
          },
        ],
      },
    })

    return true
  }

  async syncUsersIndexWithAlgolia(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: algoliaUserSelect,
    })

    if (!user) return Promise.reject(new Error('No user'))

    const usersIndex = this.algoliaService.initIndex('USERS')

    const newUserAlgoliaObject = mapAlgoliaUser(user)

    return this.algoliaService.partialUpdateObject(usersIndex, newUserAlgoliaObject, user.id)
  }

  async syncPostsIndexWithAlgolia(userId: string): Promise<Promise<undefined>[]> {
    const posts = await this.prismaService.post.findMany({ where: { authorId: userId }, select: { id: true } })

    return posts.map((post) => this.postService.syncPostIndexWithAlgolia(post.id))
  }

  async findOrCreate(phoneNumber: string, locale: string): Promise<User> {
    const user = await this.prismaService.user.upsert({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
      },
      create: {
        phoneNumber,
        locale,
      },
      update: {},
    })

    return { id: user.id }
  }

  async update(userId: string, data: UpdateUserInput): Promise<Me> {
    const schoolData = data.schoolGooglePlaceId && (await this.schoolService.getOrCreate(data.schoolGooglePlaceId))

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
