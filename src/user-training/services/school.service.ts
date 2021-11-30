import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/services/prisma.service'

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async findByGooglePlaceId(googlePlaceId: string) {
    return await this.prismaService.school.findFirst({
      where: {
        googlePlaceId: googlePlaceId,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    })
  }
}
