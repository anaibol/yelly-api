import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { getCityNameWithCountry, getGoogleCityByName, getGooglePlaceDetails } from '../utils/googlePlaces'

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async getSchool(id: string, googlePlaceId: string) {
    const school = await this.prismaService.school.findUnique({
      where: {
        ...(id && { id }),
        ...(googlePlaceId && { googlePlaceId }),
      },
      select: {
        name: true,
        id: true,
        _count: {
          select: {
            User: true,
          },
        },
      },
    })

    if (!school) return null

    return {
      ...school,
      totalUsersCount: school._count.User,
    }
  }

  async getOrCreate(googlePlaceId: string) {
    const school = await this.prismaService.school.findUnique({
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

    if (school) return school

    const googlePlaceDetail = await getGooglePlaceDetails(googlePlaceId)
    const cityName = await getCityNameWithCountry(googlePlaceId)
    const googleCity = await getGoogleCityByName(cityName)
    const city = await this.getOrCreateCity(googleCity.place_id)

    const { lat, lng } = googlePlaceDetail.geometry.location

    return {
      name: googlePlaceDetail.name,
      googlePlaceId: googlePlaceDetail.place_id,
      lat: typeof lat === 'function' ? lat() : lat,
      lng: typeof lng === 'function' ? lng() : lng,
      city,
    }
  }

  async getOrCreateCity(googlePlaceId: string) {
    const city = await this.prismaService.city.findUnique({
      where: {
        googlePlaceId,
      },
    })

    if (city) {
      return {
        googlePlaceId: city.googlePlaceId,
      }
    }

    const cityGooglePlaceDetail = await getGooglePlaceDetails(googlePlaceId)

    const { lat: cityLat, lng: cityLng } = cityGooglePlaceDetail.geometry.location

    return {
      name: cityGooglePlaceDetail.name,
      googlePlaceId: cityGooglePlaceDetail.place_id,
      lat: typeof cityLat === 'function' ? cityLat() : cityLat,
      lng: typeof cityLng === 'function' ? cityLng() : cityLng,
      country: {
        name: cityGooglePlaceDetail.address_components.find((component) => component.types.includes('country'))
          .long_name,
      },
    }
  }
}
