import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { AlgoliaService } from '../core/algolia.service'
import { Neo4jService } from './../core/neo4j.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SendbirdService } from '../core/sendbird.service'
import { SchoolService } from '../school/school.service'
import { UpdateUserInput } from './update-user.input'
import { NotFoundUserException } from './not-found-user.exception'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { User } from './user.model'
import { PushNotificationService } from 'src/core/push-notification.service'
import { Me } from './me.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { FriendRequest } from './friendRequest.model'
import { SendbirdAccessToken } from './sendbirdAccessToken'

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
    private neo4jService: Neo4jService
  ) {}

  async hasUserPostedOnTag(userId: string, tagText: string): Promise<boolean> {
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
            text: tagText,
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
                    name: true,
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

    if (!user) throw new NotFoundUserException()

    return user
  }

  async getFriendsCount(userId: string): Promise<number> {
    const OgmUser = this.neo4jService.ogm.model('User')

    const result = await OgmUser.find({
      where: {
        id: userId,
      },
      selectionSet: `
        {
          friendsAggregate {
            count
          }
        }
      `,
    })

    if (!result.length) return 0

    if (!result[0].friendsAggregate) throw new Error('No error')

    return result[0].friendsAggregate?.count
  }

  async getCommonFriendsCount(userId: string, otherUserId: string): Promise<number> {
    const session = this.neo4jService.driver.session()

    const result = await session.run(
      `MATCH (user:User { id: $userId })-[:IS_FRIEND]->(mutualFriends)-[:IS_FRIEND]->(otherUser:User { id : $otherUserId }) RETURN count(mutualFriends) as count`,
      { userId, otherUserId }
    )

    return result.records[0].get('count').toNumber()
  }

  // if (!result[0].friendsAggregate) throw new Error('No error')

  async getFriends(userId: string, after?: string, limit = DEFAULT_LIMIT): Promise<PaginatedUsers> {
    const OgmUser = this.neo4jService.ogm.model('User')

    // sort: [
    //   {
    //     createdAt: DESC
    //   }
    // ]
    const result = await OgmUser.find({
      where: {
        id: userId,
      },
      selectionSet: `
        {
          friendsConnection(first: ${limit}) {
            edges {
              node {
                id
                firstName
                lastName
                pictureId
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
            totalCount
          }
        }
      `,
    })

    return {
      items: result[0].friendsConnection.edges.map(({ node }) => ({
        id: node.id,
        firstName: node.firstName,
        lastName: node.lastName,
        pictureId: node.pictureId,
      })),
      nextCursor: result[0].friendsConnection.pageInfo.endCursor || '',
    }
  }

  async isFriend(userId: string, otherUserId: string): Promise<boolean> {
    const friend = await this.prismaService.friend.findUnique({
      where: {
        userId_otherUserId: {
          userId,
          otherUserId,
        },
      },
    })

    return !!friend
  }

  async getFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest | null> {
    return this.prismaService.friendRequest.findUnique({
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
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
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
                    name: true,
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

    if (!user) {
      throw new NotFoundUserException()
    }

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

    if (!user) throw new NotFoundUserException()

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

    if (!userUpdated) throw new NotFoundUserException()

    return user
  }

  async refreshSendbirdAccessToken(userId: string): Promise<SendbirdAccessToken> {
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
      throw new BadRequestException('Sendbird error')
    }
  }

  private generateResetToken() {
    return randomBytes(25).toString('hex')
  }

  async deleteById(userId: string): Promise<boolean> {
    try {
      await this.prismaService.user.delete({ where: { id: userId } })
      const algoliaUserIndex = await this.algoliaService.initIndex('USERS')

      this.algoliaService.deleteObject(algoliaUserIndex, userId)
      this.sendbirdService.deleteUser(userId)

      return true
    } catch {
      throw new NotFoundUserException()
    }
  }

  async createFriendRequest(userId: string, otherUserId: string): Promise<FriendRequest> {
    const friendRequest = await this.prismaService.friendRequest.create({
      data: {
        fromUser: {
          connect: {
            id: userId,
          },
        },
        toUser: {
          connect: {
            id: otherUserId,
          },
        },
        notification: {
          create: {
            userId: otherUserId,
          },
        },
      },
    })

    this.pushNotificationService.createFriendRequestPushNotification(friendRequest)

    return friendRequest
  }

  async getCommonFriends(
    userId: string,
    otherUserId: string,
    after?: string,
    limit = DEFAULT_LIMIT
  ): Promise<PaginatedUsers> {
    const session = this.neo4jService.driver.session()
    // SKIP
    // LIMIT
    const result = await session.run(
      `MATCH (user:User { id: $userId })-[:IS_FRIEND]->(mutualFriends)-[:IS_FRIEND]->(otherUser:User { id : $otherUserId }) RETURN mutualFriends`,
      { userId, otherUserId }
    )

    return {
      items: result.records.length ? result.records.map((node) => node.get('mutualFriends').properties) : [],
      nextCursor: '',
    }
  }

  async declineFriendRequest(authUserId: string, friendRequestId: string): Promise<boolean> {
    const exists = await this.prismaService.friendRequest.findFirst({
      where: {
        id: friendRequestId,
        toUserId: authUserId,
      },
    })

    if (!exists) return false

    await this.prismaService.friendRequest.update({
      where: {
        id: friendRequestId,
      },
      data: {
        status: 'DECLINED',
        notification: {
          delete: true,
        },
      },
    })

    return true
  }

  async acceptFriendRequest(authUserId: string, friendRequestId: string): Promise<boolean> {
    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        id: friendRequestId,
        toUserId: authUserId,
      },
    })

    if (!friendRequest) return false

    const { fromUserId, toUserId } = friendRequest

    await this.createFriendship(fromUserId, toUserId)

    await this.prismaService.friendRequest.update({
      where: {
        id: friendRequestId,
      },
      data: {
        status: 'ACCEPTED',
        notification: {
          delete: true,
          create: {
            userId: fromUserId,
          },
        },
      },
    })

    this.pushNotificationService.createFriendRequestAcceptedPushNotification(friendRequest)

    return true
  }

  async createFriendship(userId: string, otherUserId: string): Promise<boolean> {
    const OgmUser = this.neo4jService.ogm.model('User')

    await Promise.all([
      this.prismaService.friend.createMany({
        data: [
          {
            userId,
            otherUserId,
          },
          {
            userId: otherUserId,
            otherUserId: userId,
          },
        ],
      }),
      OgmUser.update({
        where: {
          id: userId,
        },
        connect: {
          friends: [
            {
              where: {
                node: {
                  id: otherUserId,
                },
              },
            },
          ],
        },
      }),
      OgmUser.update({
        where: {
          id: otherUserId,
        },
        connect: {
          friends: [
            {
              where: {
                node: {
                  id: userId,
                },
              },
            },
          ],
        },
      }),
    ])

    return true
  }

  deleteFriendship(userId: string, otherUserId: string) {
    return Promise.all([
      this.prismaService.friend.delete({
        where: {
          userId_otherUserId: {
            userId: userId,
            otherUserId: otherUserId,
          },
        },
      }),
      this.prismaService.friend.delete({
        where: {
          userId_otherUserId: {
            userId: otherUserId,
            otherUserId: userId,
          },
        },
      }),
    ])
    // return this.prismaService.friend.deleteMany({
    //   where: {
    //     OR: [
    //       {
    //         userId: userId,
    //         otherUserId: otherUserId,
    //       },
    //       {
    //         userId: otherUserId,
    //         otherUserId: userId,
    //       },
    //     ],
    //   },
    // })
  }

  async syncUsersIndexWithAlgolia(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: algoliaUserSelect,
    })

    if (!user) throw new Error('No user')

    const usersIndex = this.algoliaService.initIndex('USERS')

    const newUserAlgoliaObject = mapAlgoliaUser(user)

    return this.algoliaService.partialUpdateObject(usersIndex, newUserAlgoliaObject, user.id)
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
        roles: '[]',
      },
      update: {},
    })

    return { id: user.id }
  }

  async update(userId: string, data: UpdateUserInput): Promise<User> {
    const schoolData = data.schoolGooglePlaceId && (await this.schoolService.getOrCreate(data.schoolGooglePlaceId))

    const prevSchoolData = await this.prismaService.user.findUnique({
      where: { id: userId },
    })

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
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
                    name: true,
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

    if (!updatedUser) throw new NotFoundUserException()

    if (data.isFilled) {
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
        updatedUser.sendbirdAccessToken = sendbirdAccessToken
        this.syncUsersIndexWithAlgolia(userId)

        const OgmUser = this.neo4jService.ogm.model('User')

        await OgmUser.create({
          input: [
            {
              id: updatedUser.id,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              pictureId: updatedUser.pictureId,
            },
          ],
        })
      } catch (error) {
        console.log({ error })
        // CATCH ERROR SO IT CONTINUES
      }
    } else if (updatedUser.isFilled) {
      this.updateSenbirdUser(updatedUser)
      this.syncUsersIndexWithAlgolia(userId)

      const OgmUser = this.neo4jService.ogm.model('User')

      await OgmUser.update({
        where: { id: userId },
        update: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          pictureId: updatedUser.pictureId,
        },
      })
    }

    if (schoolData) {
      this.schoolService.syncAlgoliaSchool(schoolData.id)

      if (prevSchoolData && prevSchoolData.schoolId && prevSchoolData.schoolId !== schoolData.id) {
        this.schoolService.syncAlgoliaSchool(prevSchoolData.schoolId)
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
