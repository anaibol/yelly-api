import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class TrainingService {
  constructor(private prismaService: PrismaService) {}

  async create(name: string) {
    const schoolExist = await this.finfByName(name)

    if (schoolExist) return schoolExist

    const uuid = randomUUID()
    return await this.prismaService.training.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        name: name,
      },
    })
  }

  async finfByName(name: string) {
    return await this.prismaService.training.findFirst({
      where: {
        name: name,
      },
    })
  }
}
