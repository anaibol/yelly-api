import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'
import { CreateCityInput } from '../dto/create-city.input'

@Injectable()
export class CityService {
  constructor(private prismaService: PrismaService) {}

  async create(name, googlePlaceId) {
    const cityExist = await this.findByGooglePlaceId(googlePlaceId)

    if (cityExist) return cityExist

    const uuid = randomUUID()
    return await this.prismaService.city.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        name,
        googlePlaceId,
      },
    })
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return await this.prismaService.city.findFirst({
      where: {
        googlePlaceId: googlePlaceId,
      },
    })
  }
}
