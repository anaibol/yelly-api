import { Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { EmailService } from 'src/core/services/email.service'
import { PrismaService } from 'src/core/services/prisma.service'
import { NotFoundUserException } from '../exceptions/not-found-user.exception'

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
      },
      orderBy: {
        firstName: 'asc',
      },
      take: limit,
      skip: offset,
    })

    return this.mapUserBufferIdToUUID(users)
  }

  async findOne(id) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    return await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      include: {
        posts: true,
      },
    })
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new NotFoundUserException()
    }

    return this.mapUserBufferIdToUUID([user])[0]
  }

  mapUserBufferIdToUUID(users) {
    return users.map((user) => ({
      ...user,
      id: this.prismaService.mapBufferIdToString(user.id),
    }))
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

  private generateResetToken() {
    return randomBytes(5).toString('hex')
  }
}
