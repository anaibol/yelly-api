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

    return this.mapBufferIdToUUID(users)
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

    return this.mapBufferIdToUUID([user])[0]
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
        following: true,
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
    return this.mapBufferIdToUUID([user])[0]
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

  mapBufferIdToUUID(users) {
    return users.map((user) => {
      const userWithUUID = {
        ...user,
      }

      console.log('user:', user.following)

      userWithUUID.id = this.prismaService.mapBufferIdToString(user.id)
      userWithUUID.userTraining.id = this.prismaService.mapBufferIdToString(user.userTraining.id)
      userWithUUID.userTraining.city.id = this.prismaService.mapBufferIdToString(user.userTraining.city.id)
      userWithUUID.userTraining.school.id = this.prismaService.mapBufferIdToString(user.userTraining.school.id)
      userWithUUID.userTraining.training.id = this.prismaService.mapBufferIdToString(user.userTraining.training.id)
      userWithUUID.following = user.following
        ? user.following.map((userFollowing) => ({
            ...userFollowing,
            id: this.prismaService.mapBufferIdToString(userFollowing.id),
          }))
        : []
      userWithUUID.followingCount = user._count.following
      userWithUUID.followersCount = user._count.followers
      return userWithUUID
    })
  }
}
