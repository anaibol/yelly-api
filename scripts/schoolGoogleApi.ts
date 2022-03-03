import { PrismaClient } from '@prisma/client'
import { getGooglePlaceDetails, getGooglePlaceCityAndCountry, getGoogleCityByName } from '../src/utils/googlePlaces'

async function main() {
  const prisma = new PrismaClient()

  let hasSchools = true
  let skip = 0
  while (hasSchools) {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
      },
      where: {
        city: {
          id: '82a955db-554a-4fac-9f2d-63634efe7363',
        },
      },
      take: 10,
      skip: skip,
    })

    if (schools.length == 0) {
      hasSchools = false
      console.log('finish')
      return
    }
    skip += 10
    console.log('in progress: ' + skip)

    schools.forEach(async (school) => {
      if (school.googlePlaceId) {
        const googlePlaceDetail = await getGooglePlaceDetails(school.googlePlaceId, 'fr-FR')
        if (!googlePlaceDetail?.geometry?.location || !googlePlaceDetail.address_components)
          throw new Error('No googlePlaceDetail')

        const cityName = await getGooglePlaceCityAndCountry(googlePlaceDetail)

        const googleCity = await getGoogleCityByName(cityName)

        if (!googleCity) throw new Error('No CITY google ' + cityName)

        const city = await getInfosCity(googleCity.place_id)

        if (!city) throw new Error('No CITY INFOS')

        // find country
        let country = await prisma.country.findFirst({
          where: {
            code: city.country.code,
          },
        })

        if (!country) {
          country = await prisma.country.create({
            data: {
              code: city.country.code,
            },
          })
        }

        let cityDb = await prisma.city.findUnique({
          where: {
            googlePlaceId: city.googlePlaceId,
          },
          select: {
            id: true,
          },
        })

        if (cityDb) {
          await prisma.city.update({
            where: {
              id: cityDb.id,
            },
            data: {
              name: city.name,
              lat: city.lat,
              lng: city.lng,
              countryId: country?.id,
            },
          })
        } else {
          cityDb = await prisma.city.create({
            data: {
              name: city.name || '',
              lat: city.lat,
              lng: city.lng,
              countryId: country?.id || '',
            },
          })
        }

        //console.log(cityDb)

        await prisma.school.update({
          where: {
            id: school.id,
          },
          data: {
            cityId: cityDb?.id,
          },
        })

        console.log(school.name)
      }
    })
    console.log('sleep')

    await sleep(2000)
  }
}

main()

async function getInfosCity(googlePlaceId: string) {
  const cityGooglePlaceDetail = await getGooglePlaceDetails(googlePlaceId, 'fr-FR')

  if (!cityGooglePlaceDetail?.address_components || !cityGooglePlaceDetail?.geometry?.location)
    throw new Error('No cityGooglePlaceDetail')

  const { lat: cityLat, lng: cityLng } = cityGooglePlaceDetail.geometry.location

  const country = cityGooglePlaceDetail.address_components.find((component) => component.types.includes('country'))

  if (!country) throw new Error('No country')

  return {
    name: cityGooglePlaceDetail.name,
    googlePlaceId: cityGooglePlaceDetail.place_id,
    lat: typeof cityLat === 'function' ? cityLat() : cityLat,
    lng: typeof cityLng === 'function' ? cityLng() : cityLng,
    country: {
      code: country.short_name,
    },
  }
}

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
