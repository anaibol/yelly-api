import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class userTrainingService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: Buffer, trainingId: Buffer, cityId: Buffer, schoolId: Buffer, dateBegin: Date) {
    const uuid = randomUUID()
    return await this.prismaService.userTraining.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        userId: userId,
        trainingId: trainingId,
        cityId: cityId,
        schoolId: schoolId,
        dateBegin: dateBegin,
        createdAt: new Date(),
      },
    })
  }
}
