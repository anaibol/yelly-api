import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'
import { CreateSchoolInput } from '../dto/create-school.input'

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async create(name, googlePlaceId, lat?, lng?, cityId?) {
    const schoolExist = await this.findByGooglePlaceId(googlePlaceId)

    if (schoolExist) return schoolExist

    const uuid = randomUUID()
    return await this.prismaService.school.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        name,
        googlePlaceId,
        lat,
        lng,
        cityId,
        isValid: true,
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
