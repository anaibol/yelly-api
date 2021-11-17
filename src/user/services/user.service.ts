import { Injectable } from '@nestjs/common'
import { randomBytes, randomUUID } from 'crypto'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { EmailService } from 'src/core/services/email.service'
import { PrismaService } from 'src/core/services/prisma.service'
import { UserCreateInput } from '../dto/create-user.input'
import { NotFoundUserException } from '../exceptions/not-found-user.exception'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService, private emailService: EmailService) {}

  async hasUserPostedOnTag(email, tagText) {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        owner: {
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
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            tags: true,
            owner: true,
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
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          include: {
            tags: true,
            owner: true,
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

  mapBufferIdToUUID(users) {
    return users.map((user) => {
      const userWithUUID = {
        ...user,
      }

      userWithUUID.id = this.prismaService.mapBufferIdToString(user.id)
      userWithUUID.userTraining.id = this.prismaService.mapBufferIdToString(user.userTraining.id)
      userWithUUID.userTraining.city.id = this.prismaService.mapBufferIdToString(user.userTraining.city.id)
      userWithUUID.userTraining.school.id = this.prismaService.mapBufferIdToString(user.userTraining.school.id)
      userWithUUID.userTraining.training.id = this.prismaService.mapBufferIdToString(user.userTraining.training.id)
      return userWithUUID
    })
  }
}
