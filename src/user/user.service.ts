import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { AlgoliaService } from '../core/algolia.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SendbirdService } from '../core/sendbird.service'
import { SchoolService } from '../school/school.service'
import { UpdateUserInput } from './update-user.input'
import { NotFoundUserException } from './not-found-user.exception'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { User } from './user.model'
import { NotificationService } from 'src/notification/notification.service'
import { PushNotificationService } from 'src/core/push-notification.service'

@Injectable()
export class UserService {
  googleApiKey = process.env.GOOGLE_API_KEY
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private algoliaService: AlgoliaService,
    private schoolService: SchoolService,
    private sendbirdService: SendbirdService,
    private notificationService: NotificationService,
    private pushNotificationService: PushNotificationService
  ) {}

  async hasUserPostedOnTag(userId, tagText): Promise<boolean> {
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

  findByEmail(email: string): Promise<{
    id: string
    password: string
  }> {
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

  async findOne(userId) {
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
        _count: {
          select: {
            followeesFollowships: true,
            followersFollowships: true,
          },
        },
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

    return {
      ...user,
      followersCount: user._count.followeesFollowships,
      followeesCount: user._count.followersFollowships,
    }
  }

  async getUserFollowers(userId, currentCursor, limit = DEFAULT_LIMIT) {
    const followers = await this.prismaService.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .followeesFollowships({
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
        select: {
          id: true,
          createdAt: true,
          follower: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pictureId: true,
              school: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

    const mappedFollowers = followers.map(({ follower, createdAt }) => ({ ...follower, createdAt }))

    const nextCursor = mappedFollowers.length === limit ? mappedFollowers[limit - 1].createdAt.getTime().toString() : ''

    return { items: mappedFollowers, nextCursor }
  }

  async getUserFollowees(userId, currentCursor, limit = DEFAULT_LIMIT) {
    const followees = await this.prismaService.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .followeesFollowships({
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
        select: {
          id: true,
          createdAt: true,
          followee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              pictureId: true,
              school: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

    const mappedFollowees = followees.map(({ followee, createdAt }) => ({ ...followee, createdAt }))

    const nextCursor = mappedFollowees.length === limit ? mappedFollowees[limit - 1].createdAt.getTime().toString() : ''

    return { items: mappedFollowees, nextCursor }
  }

  async isFollowingAuthUser(id: string, authUserId: string): Promise<boolean> {
    const result = await this.prismaService.followship.findUnique({
      where: {
        followerId_followeeId: {
          followerId: id,
          followeeId: authUserId,
        },
      },
    })

    return !!result
  }

  async isAuthUserFollowing(authUserId: string, id: string): Promise<boolean> {
    const result = await this.prismaService.followship.findUnique({
      where: {
        followerId_followeeId: {
          followerId: authUserId,
          followeeId: id,
        },
      },
    })

    return !!result
  }

  async findMe(userId: string) {
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
        _count: {
          select: {
            followeesFollowships: true,
            followersFollowships: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
            googlePlaceId: true,
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
            _count: {
              select: {
                users: true,
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
      // THIS IS THE OPOSITE
      followeesCount: user._count.followersFollowships,
      followersCount: user._count.followeesFollowships,
      ...(user.school && {
        school: {
          ...user.school,
          totalUsersCount: user.school?._count.users,
        },
      }),
      expoPushNotificationTokens: user.expoPushNotificationTokens.map(({ token }) => token),
    }
  }

  async requestResetPassword(email: string) {
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

  async resetPassword(password: string, resetToken: string) {
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

    const formattedUser = {
      ...user,
      id: user.id,
    }
    return formattedUser
  }

  async refreshSendbirdAccessToken(userId: string) {
    try {
      const accessToken = await this.sendbirdService.getAccessToken(userId)

      this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          sendbirdAccessToken: accessToken,
        },
      })
      return accessToken
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

  async toggleFollow(authUserId: string, otherUserId: string, value: boolean) {
    const followshipData = {
      followerId: authUserId,
      followeeId: otherUserId,
    }

    if (value) {
      const followship = await this.prismaService.followship.create({
        data: followshipData,
      })
      this.notificationService.createFollowshipNotification(otherUserId, followship.id)
      this.pushNotificationService.createFollowshipPushNotification(followshipData)
    } else {
      await this.prismaService.followship.delete({
        where: {
          followerId_followeeId: followshipData,
        },
      })
    }

    return true
  }

  async syncUsersIndexWithAlgolia(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: algoliaUserSelect,
    })

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

  async updateMe(updateUserData: UpdateUserInput, userId: string): Promise<User> {
    const schoolData =
      updateUserData.schoolGooglePlaceId && (await this.schoolService.getOrCreate(updateUserData.schoolGooglePlaceId))

    const prevSchoolData =
      schoolData &&
      (await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          schoolId: true,
        },
      }))

    const updatedUser = await this.prismaService.user.update({
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
      where: {
        id: userId,
      },
      data: {
        firstName: updateUserData.firstName,
        lastName: updateUserData.lastName,
        email: updateUserData.email,
        password: updateUserData.password,
        birthdate: updateUserData.birthdate,
        instagram: updateUserData.instagram,
        snapchat: updateUserData.snapchat,
        pictureId: updateUserData.pictureId,
        avatar3dId: updateUserData.avatar3dId,
        about: updateUserData.about,
        isFilled: updateUserData.isFilled,
        ...(schoolData && {
          school: {
            connect: {
              id: schoolData.id,
            },
          },
        }),
        ...(updateUserData.trainingName && {
          training: {
            connectOrCreate: {
              where: {
                name: updateUserData.trainingName,
              },
              create: {
                name: updateUserData.trainingName,
              },
            },
          },
        }),
      },
    })

    if (updateUserData.isFilled) {
      try {
        const sendbirdAccessToken = await this.sendbirdService.createUser(updatedUser)

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
      } catch (error) {
        // CATCH ERROR SO IT CONTINUES
      }
    } else if (updatedUser.isFilled) {
      this.updateSenbirdUser(updatedUser)
      this.syncUsersIndexWithAlgolia(userId)
    }

    if (schoolData?.id) {
      this.schoolService.syncAlgoliaSchool(schoolData.id)

      if (prevSchoolData?.schoolId && prevSchoolData.schoolId !== schoolData.id) {
        this.schoolService.syncAlgoliaSchool(prevSchoolData.schoolId)
      }
    }

    return updatedUser
  }

  async updateSenbirdUser(user) {
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
