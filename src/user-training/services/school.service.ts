import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'
import { CreateSchoolInput } from '../dto/create-school.input'

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async create(schoolData: CreateSchoolInput) {
    const schoolExist = await this.findByGooglePlaceId(schoolData.googlePlaceId)

    if (schoolExist) return schoolExist

    const uuid = randomUUID()
    return await this.prismaService.school.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        name: schoolData.name,
        googlePlaceId: schoolData.googlePlaceId,
      },
    })
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return await this.prismaService.school.findFirst({
      where: {
        googlePlaceId: googlePlaceId,
      },
    })
  }
}
