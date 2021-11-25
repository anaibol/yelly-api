import { Injectable } from '@nestjs/common'
import { School, Training, User, UserTraining } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { randomBytes, randomUUID } from 'crypto'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { AlgoliaService } from 'src/core/services/algolia.service'
import { EmailService } from 'src/core/services/email.service'
import { PrismaService } from 'src/core/services/prisma.service'
import { CityService } from 'src/user-training/services/city.service'
import { SchoolService } from 'src/user-training/services/school.service'
import { TrainingService } from 'src/user-training/services/training.service'
import { UserTrainingService } from 'src/user-training/services/user-training.service'
import { UserCreateInput } from '../dto/create-user.input'
import { SignUpInput } from '../dto/sign-up.input'
import { NotFoundUserException } from '../exceptions/not-found-user.exception'
import { UserIndexAlgoliaInterface } from '../interfaces/user-index-algolia.interface'

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private algoliaService: AlgoliaService,
    private cityService: CityService,
    private schoolService: SchoolService,
    private trainingService: TrainingService,
    private userTrainingService: UserTrainingService
  ) {}

  async hasUserPostedOnTag(email, tagText) {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        author: {
          email: email,
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

  async find(offset = 0, limit = DEFAULT_LIMIT) {
    const users = await this.prismaService.user.findMany({
      include: {
        posts: true,
        userTraining: {
          include: {
            city: true,
            training: true,
            school: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
      take: limit,
      skip: offset,
    })

    return this.formatUser(users)
  }

  async findOne(id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const user = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            createdAt: true,
            id: true,
            tags: {
              select: {
                text: true,
                isLive: true,
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
            text: true,
          },
        },
        userTraining: {
          select: {
            id: true,
            dateBegin: true,
            city: {
              select: {
                id: true,
                name: true,
              },
            },
            school: {
              select: {
                id: true,
                name: true,
              },
            },
            training: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return this.formatUser(user)
  }

  async getUserFollowers(id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const { followers } = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        followers: {
          select: {
            id: true,
            firstName: true,
            userTraining: {
              select: {
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return followers.map((otherUserFollowers) => {
      const id = this.prismaService.mapBufferIdToString(otherUserFollowers.id)

      return {
        ...otherUserFollowers,
        id,
      }
    })
  }

  async getUserFollowings(id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const otherUser = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        following: {
          select: {
            firstName: true,
            id: true,
            userTraining: {
              select: {
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return otherUser.following.map((otherUserFollowings) => {
      const id = this.prismaService.mapBufferIdToString(otherUserFollowings.id)

      return {
        ...otherUserFollowings,
        id,
      }
    })
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
        following: {
          select: {
            id: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            createdAt: true,
            id: true,
            tags: {
              select: {
                text: true,
                isLive: true,
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
                pictureId: true,
                id: true,
              },
            },
            text: true,
          },
        },
        userTraining: {
          select: {
            id: true,
            dateBegin: true,
            city: {
              select: {
                id: true,
                name: true,
              },
            },
            school: {
              select: {
                id: true,
                name: true,
              },
            },
            training: {
              select: {
                id: true,
                name: true,
              },
            },
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
    const user = await this.findByEmail(email)

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

    return user
  }

  async create(createUserData: UserCreateInput) {
    const saltOrRounds = 10
    const password = createUserData.password
    const hash = await bcrypt.hash(password, saltOrRounds)

    const user = await this.prismaService.user.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(randomUUID()),
        firstName: createUserData.firstName,
        lastName: createUserData.lastName,
        email: createUserData.email,
        password: hash,
        birthdate: new Date(createUserData.birthdate),
        pictureId: createUserData.pictureId,
        snapchat: createUserData.snapchat,
        instagram: createUserData.instagram,
        roles: '[]',
        isVerified: true,
        createdAt: new Date(),
        isFilled: true,
        isActived: true,
      },
    })

    return user
  }

  private generateResetToken() {
    return randomBytes(5).toString('hex')
  }

  async deleteByEmail(email: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          email: email,
        },
      })
      return true
    } catch {
      throw new NotFoundUserException()
    }
  }

  async toggleFollow(authUserEmail: string, otherUserId: string, value: boolean) {
    const { id: authUserId } = await this.prismaService.user.findUnique({
      where: {
        email: authUserEmail,
      },
      select: {
        id: true,
      },
    })

    await this.prismaService.user.update({
      data: {
        following: {
          [value ? 'connect' : 'disconnect']: {
            id: this.prismaService.mapStringIdToBuffer(otherUserId),
          },
        },
      },
      where: {
        id: authUserId,
      },
      include: {
        following: true,
      },
    })

    return true
  }

  async syncUsersIndexWithAlgolia(user: User, userTraining: UserTraining, training: Training, school: School) {
    const usersIndex = this.algoliaService.initIndex('USERS')

    const countryOfTheSchool = await this.prismaService.country.findFirst({
      where: {
        id: school.countryId,
      },
    })

    const newUserAlgoliaObject: UserIndexAlgoliaInterface = {
      lastName: user.lastName,
      firstName: user.firstName,
      birthdateTimestamp: Date.parse(user.birthdate.toString()),
      hasPicture: user.pictureId != null,
      id: this.prismaService.mapBufferIdToString(user.id),
      lastTraining: {
        id: this.prismaService.mapBufferIdToString(userTraining.id),
        training: {
          id: this.prismaService.mapBufferIdToString(training.id),
          name: training.name,
        },
        school: {
          id: this.prismaService.mapBufferIdToString(school.id),
          name: school.name,
          countryName: countryOfTheSchool.name,
          postalCode: school.postalCode,
          googlePlaceId: school.googlePlaceId,
          _geoloc: {
            lat: school.lat,
            lng: school.lng,
          },
        },
      },
    }

    return this.algoliaService.saveObject(
      usersIndex,
      newUserAlgoliaObject,
      this.prismaService.mapBufferIdToString(user.id)
    )
  }

  async signUp(signUpData: SignUpInput) {
    const [city, school, training, user] = await Promise.all([
      this.cityService.create(signUpData.userTraining.city),
      this.schoolService.create(signUpData.userTraining.school),
      this.trainingService.create(signUpData.userTraining.training),
      this.create(signUpData.user),
    ])
    const userTraining = await this.userTrainingService.create(
      user.id,
      training.id,
      city.id,
      school.id,
      signUpData.userTraining.dateBegin
    )

    this.syncUsersIndexWithAlgolia(user, userTraining, training, school)

    return user
  }

  formatUser(user) {
    const formattedUser = {
      ...user,
    }

    formattedUser.id = this.prismaService.mapBufferIdToString(user.id)
    formattedUser.userTraining.id = this.prismaService.mapBufferIdToString(user.userTraining.id)
    formattedUser.userTraining.city.id = this.prismaService.mapBufferIdToString(user.userTraining.city.id)
    formattedUser.userTraining.school.id = this.prismaService.mapBufferIdToString(user.userTraining.school.id)
    formattedUser.userTraining.training.id = this.prismaService.mapBufferIdToString(user.userTraining.training.id)
    formattedUser.followingCount = user._count.following
    formattedUser.followersCount = user._count.followers

    formattedUser.following = user.following
      ? user.following.map((userFollowing) => ({
          ...userFollowing,
          id: this.prismaService.mapBufferIdToString(userFollowing.id),
        }))
      : []

    formattedUser.followers = user.followers
      ? user.followers.map((userFollower) => ({
          ...userFollower,
          id: this.prismaService.mapBufferIdToString(userFollower.id),
        }))
      : []

    formattedUser.posts = user.posts
      ? user.posts.map((post) => ({
          ...post,
          author: {
            ...post.author,
            id: this.prismaService.mapBufferIdToString(post.author.id),
          },
        }))
      : []

    return formattedUser
  }
}
