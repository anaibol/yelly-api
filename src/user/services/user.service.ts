import { Injectable } from '@nestjs/common'
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constant'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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

    return this.mapBufferIdToUUID(users)
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
      include: {
        posts: true,
        userTraining: {
          include: {
            city: true,
            school: true,
            training: true,
          },
        },
      },
    })

    if (!user) return null

    return this.mapBufferIdToUUID([user])[0]
  }

  mapBufferIdToUUID(users) {
    return users.map((user) => {
      const userWithUUID = {
        ...user,
      }
      userWithUUID.id = this.prismaService.mapBufferIdToString(user.id)

      if (userWithUUID.userTraining) {
        userWithUUID.userTraining = user.userTraining.map((ut) => {
          const utWithUUID = {
            ...ut,
          }

          utWithUUID.id = this.prismaService.mapBufferIdToString(ut.id)
          utWithUUID.city.id = this.prismaService.mapBufferIdToString(ut.city.id)
          utWithUUID.school.id = this.prismaService.mapBufferIdToString(ut.school.id)
          utWithUUID.training.id = this.prismaService.mapBufferIdToString(ut.training.id)

          return utWithUUID
        })
      }

      return userWithUUID
    })
  }
}
