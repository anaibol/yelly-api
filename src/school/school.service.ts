import { Injectable } from '@nestjs/common'
import { AlgoliaService } from 'src/core/algolia.service'
import { algoliaSchoolSelect } from 'src/utils/algolia'
import { PrismaService } from '../core/prisma.service'
import {
  getCityNameWithCountry,
  getCountryLanguageCode,
  getGoogleCityByName,
  getGooglePlaceDetails,
} from '../utils/googlePlaces'
import { SchoolIndexAlgoliaInterface } from './school-index-algolia.interface'

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService, private algoliaService: AlgoliaService) {}

  async syncAlgoliaSchool(schoolId: string) {
    const algoliaTagIndex = await this.algoliaService.initIndex('SCHOOLS')

    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: algoliaSchoolSelect,
    })

    if (!school) return

    const objectToUpdateOrCreate: SchoolIndexAlgoliaInterface = {
      id: school.id,
      name: school.name,
      googlePlaceId: school.googlePlaceId,
      _geoloc: {
        lat: school.lat,
        lng: school.lng,
      },
      city: {
        id: school.city.id,
        name: school.city.name,
        _geoloc: {
          lat: school.city.lat,
          lng: school.city.lng,
        },
        country: {
          id: school.city.country.id,
          name: school.city.country.name,
        },
      },
      userCount: school._count.users,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, school.id)
  }

  async getSchool(id: string, googlePlaceId: string) {
    const school = await this.prismaService.school.findUnique({
      where: {
        ...(id && { id }),
        ...(googlePlaceId && { googlePlaceId }),
      },
      select: {
        name: true,
        id: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            pictureId: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    if (!school) return null

    return {
      ...school,
      totalUsersCount: school._count.users,
    }
  }

  async getOrCreate(googlePlaceId: string) {
    const school = await this.prismaService.school.findUnique({
      where: {
        googlePlaceId,
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
    const cityName = await getCityNameWithCountry(googlePlaceDetail)
    const googleCity = await getGoogleCityByName(cityName)
    const city = await this.getOrCreateCity(googleCity.place_id)
    const countryLanguageCode = await getCountryLanguageCode(googlePlaceDetail.address_components)
    const googlePlaceDetailTranslated = await getGooglePlaceDetails(googlePlaceId, countryLanguageCode)
    const { lat, lng } = googlePlaceDetail.geometry.location

    const schoolData = {
      name: googlePlaceDetailTranslated.name,
      googlePlaceId: googlePlaceDetail.place_id,
      lat: typeof lat === 'function' ? lat() : lat,
      lng: typeof lng === 'function' ? lng() : lng,
      city,
    }

    return this.prismaService.school.create({
      data: {
        name: schoolData.name,
        googlePlaceId: schoolData.googlePlaceId,
        lat: schoolData.lat,
        lng: schoolData.lng,
        city: {
          connectOrCreate: {
            where: {
              googlePlaceId: schoolData.city.googlePlaceId,
            },
            create: {
              name: schoolData.city.name,
              googlePlaceId: schoolData.city.googlePlaceId,
              lat: schoolData.city.lat,
              lng: schoolData.city.lng,
              country: {
                connectOrCreate: {
                  where: {
                    name: schoolData.city.country.name,
                  },
                  create: {
                    name: schoolData.city.country.name,
                  },
                },
              },
            },
          },
        },
      },
    })
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
