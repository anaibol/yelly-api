import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/core/services/prisma.service'
import { CreateCityInput } from '../dto/create-city.input'

@Injectable()
export class CityService {
  constructor(private prismaService: PrismaService) {}

  async create(cityData: CreateCityInput) {
    const cityExist = await this.findByGooglePlaceId(cityData.googlePlaceId)

    if (cityExist) return cityExist

    const uuid = randomUUID()
    return await this.prismaService.city.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(uuid),
        name: cityData.name,
        googlePlaceid: cityData.googlePlaceId,
      },
    })
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return await this.prismaService.city.findFirst({
      where: {
        googlePlaceid: googlePlaceId,
      },
    })
  }
}
