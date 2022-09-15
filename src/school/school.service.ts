import { Injectable } from '@nestjs/common'
import { City, Country, School } from '@prisma/client'
import { AlgoliaService } from 'src/core/algolia.service'
import { algoliaSchoolSelect } from 'src/utils/algolia'

import { PrismaService } from '../core/prisma.service'
import {
  getCountryLanguageCode,
  getGoogleCityByName,
  getGooglePlaceCityAndCountry,
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
          code: school.city.country.code,
        },
      },
      userCount: school._count.users,
    }

    return this.algoliaService.partialUpdateObject(algoliaTagIndex, objectToUpdateOrCreate, school.id)
  }

  async getSchool(id?: string, googlePlaceId?: string) {
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
            displayName: true,
            username: true,
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

  async getOrCreate(googlePlaceId: string): Promise<
    School & {
      city: City & {
        country: Country
      }
    }
  > {
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

    const schoolPlace = await getGooglePlaceDetails(googlePlaceId)

    if (!schoolPlace?.geometry?.location || !schoolPlace.address_components)
      return Promise.reject(new Error('No schoolPlace'))

    const cityNameWithCountry = await getGooglePlaceCityAndCountry(schoolPlace)
    const googleCity = await getGoogleCityByName(cityNameWithCountry)
    const city = await this.getOrCreateCity(googleCity.place_id)

    const countryLanguageCode = await getCountryLanguageCode(schoolPlace.address_components)
    const googlePlaceDetailTranslated = await getGooglePlaceDetails(googlePlaceId, countryLanguageCode)

    if (!googlePlaceDetailTranslated) return Promise.reject(new Error('No schoolPlace'))

    const { lat, lng } = schoolPlace.geometry.location

    const schoolData = {
      name: googlePlaceDetailTranslated.name,
      googlePlaceId: schoolPlace.place_id,
      lat: typeof lat === 'function' ? lat() : lat,
      lng: typeof lng === 'function' ? lng() : lng,
      cityId: city.id,
    }

    if (!schoolPlace.name || !schoolData.name) return Promise.reject(new Error('No school google place data'))

    return this.prismaService.school.create({
      data: {
        name: schoolData.name,
        googlePlaceId: schoolData.googlePlaceId,
        lat: schoolData.lat,
        lng: schoolData.lng,
        cityId: schoolData.cityId,
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

  async getOrCreateCity(googlePlaceId: string): Promise<City> {
    const city = await this.prismaService.city.findUnique({
      where: {
        googlePlaceId,
      },
    })

    if (city) return city

    const cityGooglePlaceDetail = await getGooglePlaceDetails(googlePlaceId)

    if (
      !cityGooglePlaceDetail?.address_components ||
      !cityGooglePlaceDetail?.geometry?.location ||
      !cityGooglePlaceDetail?.name
    )
      return Promise.reject(new Error('No cityGooglePlaceDetail'))

    const { lat: cityLat, lng: cityLng } = cityGooglePlaceDetail.geometry.location

    const country = cityGooglePlaceDetail.address_components.find((component) => component.types.includes('country'))

    if (!country) return Promise.reject(new Error('No country'))

    return this.prismaService.city.create({
      data: {
        name: cityGooglePlaceDetail.name,
        googlePlaceId: cityGooglePlaceDetail.place_id,
        lat: typeof cityLat === 'function' ? cityLat() : cityLat,
        lng: typeof cityLng === 'function' ? cityLng() : cityLng,
        country: {
          connectOrCreate: {
            where: {
              code: country.short_name.toLowerCase(),
            },
            create: {
              code: country.short_name.toLowerCase(),
            },
          },
        },
      },
    })
  }
}
