import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class UserTrainingService {
  constructor(private prismaService: PrismaService) {}

  create(userId: Buffer, trainingId: Buffer, cityId: Buffer, schoolId: Buffer, dateBegin: Date) {
    const uuid = randomUUID()

    return this.prismaService.userTraining.create({
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

  async UpdateOneById(
    id: string,
    trainingId: Buffer | null,
    cityId: Buffer | null,
    schoolId: Buffer | null,
    dateBegin: Date | null
  ) {
    const data: any = {}

    if (trainingId) data.trainingId = trainingId
    if (cityId) data.cityId = cityId
    if (schoolId) data.schoolId = schoolId
    if (dateBegin) data.dateBegin = dateBegin

    return await this.prismaService.userTraining.update({
      where: {
        id: this.prismaService.mapStringIdToBuffer(id),
      },
      data: data,
    })
  }
}
