import { Injectable } from '@nestjs/common'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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

    if (!user) return null

    return this.mapUserBufferIdToUUID([user])[0]
  }

  mapUserBufferIdToUUID(users) {
    return users.map((user) => ({
      ...user,
      id: this.prismaService.mapBufferIdToString(user.id),
    }))
  }
}
