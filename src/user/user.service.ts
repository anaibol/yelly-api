import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { AlgoliaService } from '../core/algolia.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SendbirdService } from '../core/sendbird.service'
import { SchoolService } from './school.service'
import { SignUpInput } from './sign-up.input'
import { UpdateUserInput } from './update-user.input'
import { NotFoundUserException } from './not-found-user.exception'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { User } from './user.model'

const cleanUndefinedFromObj = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v === undefined ? a : ((a[k] = v), a)), {})

@Injectable()
export class UserService {
  googleApiKey = process.env.GOOGLE_API_KEY
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private algoliaService: AlgoliaService,
    private schoolService: SchoolService,
    private sendbirdService: SendbirdService
  ) {}

  async hasUserPostedOnTag(userId, tagText) {
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

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    })

    return {
      ...user,
      id: user.id,
    }
  }

  async findOne(userId) {
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
        instagram: true,
        snapchat: true,
        _count: {
          select: {
            followeesFollowships: true,
            followersFollowships: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            viewsCount: true,
            text: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
            tags: {
              select: {
                id: true,
                text: true,
                isLive: true,
              },
            },
            reactions: {
              select: {
                id: true,
                reaction: true,
                authorId: true,
              },
              distinct: 'reaction',
              take: 2,
            },
            _count: {
              select: {
                reactions: true,
              },
            },
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

    return this.formatUser(user)
  }

  async getUserFollowers(id, currentCursor, limit = DEFAULT_LIMIT) {
    const followers = await this.prismaService.followship.findMany({
      where: {
        followeeId: id,
        ...(currentCursor && {
          cursor: {
            createdAt: new Date(+currentCursor).toISOString(),
          },
          skip: 1, // Skip the cursor
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pictureId: true,
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return followers.map(({ follower: { id, ...folower } }) => ({
      ...folower,
      id,
    }))
  }

  async getUserFollowees(id, currentCursor, limit = DEFAULT_LIMIT) {
    const followees = await this.prismaService.followship.findMany({
      where: {
        followerId: id,
        ...(currentCursor && {
          cursor: {
            createdAt: new Date(+currentCursor).toISOString(),
          },
          skip: 1, // Skip the cursor
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        followee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pictureId: true,
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return followees.map(({ followee: { id, ...followee } }) => ({
      ...followee,
      id: id,
    }))
  }

  async isFollowingAuthUser(id, authUserId: string) {
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
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            viewsCount: true,
            text: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
            tags: {
              select: {
                id: true,
                text: true,
                isLive: true,
              },
            },
            reactions: {
              select: {
                id: true,
                reaction: true,
                authorId: true,
              },
              distinct: 'reaction',
              take: 2,
            },
            _count: {
              select: {
                reactions: true,
                comments: true,
              },
            },
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

    return this.formatUser(user)
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

  async deleteById(userId: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      })

      this.sendbirdService.deleteUser(userId)
      const usersAlgoliaIndex = this.algoliaService.initIndex('USERS')
      usersAlgoliaIndex.deleteObject(userId)
      return true
    } catch {
      throw new NotFoundUserException()
    }
  }

  async toggleFollow(authUserId: string, otherUserId: string, value: boolean) {
    const followship = {
      followerId: authUserId,
      followeeId: otherUserId,
    }

    if (value) {
      await this.prismaService.followship.create({
        data: followship,
      })
    } else {
      await this.prismaService.followship.delete({
        where: {
          followerId_followeeId: followship,
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

  async signUp(signUpData: SignUpInput) {
    const { email, password, locale } = signUpData

    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })

    if (userExists) throw new ForbiddenException('Email exists')

    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hash,
        locale,
        roles: '[]',
      },
    })

    return {
      id: user.id,
    }
  }

  async updateMe(updateUserData: UpdateUserInput, userId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isFilled: true,
      },
    })

    if (!user) {
      throw new NotFoundException()
    }

    const schoolData =
      updateUserData.schoolGooglePlaceId && (await this.schoolService.getOrCreate(updateUserData.schoolGooglePlaceId))

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
        isFilled: true,
        // ...(updateUserData.isFilled && {
        email: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        avatar3dId: true,
        birthdate: true,
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
        // }),
      },
      data: {
        ...cleanUndefinedFromObj({
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
        }),
        ...(updateUserData.trainingName && {
          school: {
            connectOrCreate: {
              where: {
                googlePlaceId: schoolData.googlePlaceId,
              },
              create: {
                name: schoolData.name,
                googlePlaceId: schoolData.googlePlaceId,
                lat: schoolData.lat,
                lng: schoolData.lng,
                city: {
                  connectOrCreate: {
                    where: {
                      googlePlaceId: schoolData.city.googlePlaceId,
                    },
                    create: {
                      name: schoolData.city.name,
                      googlePlaceId: schoolData.city.googlePlaceId,
                      lat: schoolData.city.lat,
                      lng: schoolData.city.lng,
                      country: {
                        connectOrCreate: {
                          where: {
                            name: schoolData.city.country.name,
                          },
                          create: {
                            name: schoolData.city.country.name,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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

    if (!user.isFilled && updatedUser.isFilled) {
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
      } catch (error) {
        console.log(error)
      }
    } else if (updatedUser.isFilled) {
      if (updatedUser.firstName || updatedUser.lastName || updatedUser.pictureId) {
        this.updateSenbirdUser(updatedUser)
      }

      this.syncUsersIndexWithAlgolia(user.id)
    }

    return this.formatUser(updatedUser)
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

  formatUser(user) {
    const formattedUser = user

    if (user._count) {
      formattedUser.followeesCount = user._count.followersFollowships
      formattedUser.followersCount = user._count.followeesFollowships
    }

    formattedUser.posts = user.posts
      ? user.posts.map((post) => ({
          ...post,
          totalReactionsCount: post._count.reactions,
          totalCommentsCount: post._count.comments,
        }))
      : []

    return formattedUser
  }
}
