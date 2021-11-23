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
import { set } from 'lodash'

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
      include: {
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
        following: {
          include: {
            userTraining: {
              include: {
                school: true,
              },
            },
          },
        },
        followers: {
          include: {
            userTraining: {
              include: {
                school: true,
              },
            },
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            tags: true,
            author: true,
          },
        },
        userTraining: {
          include: {
            city: true,
            school: true,
            training: true,
          },
        },
      },
    })

    return this.formatUser(user)
  }

  async getUserFollowers(email, id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)
    const authUserFollowing = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        following: {
          select: {
            id: true,
          },
        },
      },
    })

    const followingIds = authUserFollowing.following.map((followedUser) =>
      this.prismaService.mapBufferIdToString(followedUser.id)
    )

    const userFollowers = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        firstName: true,
        followers: {
          where: {
            NOT: {
              id: authUserFollowing.id,
            },
          },
          select: {
            id: true,
            firstName: true,
            userTraining: {
              select: {
                school: true,
              },
            },
          },
        },
      },
    })

    const otherUserFollowers = userFollowers.followers.map((otherUserFollowers) => {
      const id = this.prismaService.mapBufferIdToString(otherUserFollowers.id)
      const isAuthUserFollowing = followingIds.includes(id)
      return {
        ...otherUserFollowers,
        id: this.prismaService.mapBufferIdToString(otherUserFollowers.id),
        isAuthUserFollowing,
      }
    })

    set(userFollowers, 'followers', otherUserFollowers)

    return userFollowers
  }

  async getUserFollowing(email, id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const authUserFollowing = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        following: {
          select: {
            id: true,
          },
        },
      },
    })

    const followingIds = authUserFollowing.following.map((followedUser) =>
      this.prismaService.mapBufferIdToString(followedUser.id)
    )

    const userFollowers = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        following: {
          where: {
            NOT: {
              id: authUserFollowing.id,
            },
          },
          select: {
            firstName: true,
            id: true,
            userTraining: {
              select: {
                school: true,
              },
            },
          },
        },
      },
    })

    const otherUserFollowings = userFollowers.following.map((otherUserFollowings) => {
      const id = this.prismaService.mapBufferIdToString(otherUserFollowings.id)
      const isAuthUserFollowing = followingIds.includes(id)
      return {
        ...otherUserFollowings,
        id: this.prismaService.mapBufferIdToString(otherUserFollowings.id),
        isAuthUserFollowing,
      }
    })

    set(userFollowers, 'following', otherUserFollowings)

    return userFollowers
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
        following: {
          include: {
            userTraining: {
              include: {
                school: true,
              },
            },
          },
        },
        followers: {
          include: {
            userTraining: {
              include: {
                school: true,
              },
            },
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            tags: true,
            author: true,
          },
        },
        userTraining: {
          include: {
            city: true,
            school: true,
            training: true,
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
    return formattedUser
  }
}
