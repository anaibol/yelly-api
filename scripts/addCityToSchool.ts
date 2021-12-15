import { PrismaClient } from '.prisma/client'
import { getCityNameWithCountry, getGoogleCityByName, getGooglePlaceDetails } from 'src/utils/googlePlaces'

async function main() {
  const prisma = new PrismaClient()

  const allSchools = await prisma.school.findMany({
    where: {
      NOT: {
        googlePlaceId: null,
      },
      cityId: null,
    },
    select: {
      id: true,
      name: true,
      googlePlaceId: true,
    },
    take: 150,
  })

  //console.log(allSchools)
  allSchools.map(async ({ id, googlePlaceId }) => {
    console.log(googlePlaceId)
    await prisma.school.update({
      where: {
        id,
      },
      data: {},
    })

    const googlePlaceCityName = await getCityNameWithCountry(googlePlaceId)

    if (googlePlaceCityName) {
      const googleCity = await getGoogleCityByName(googlePlaceCityName)

      if (googleCity) {
        const googlePlaceCity = await getGooglePlaceDetails(googleCity.place_id)
        //console.log({ googlePlaceCity })
        if (googlePlaceCity) {
          let cityExist = await prisma.city.findUnique({
            where: {
              googlePlaceId: googlePlaceCity.place_id,
            },
          })

          //console.log({ cityExist })

          if (!cityExist) {
            const address_components = googlePlaceCity.address_components

            let countryName: string

            address_components.map((component) => {
              if (component.types.includes('country')) countryName = component.long_name
            })

            const { id: countryId } =
              (await prisma.country.findFirst({
                where: {
                  name: countryName,
                },
              })) ||
              (await prisma.country.create({
                data: {
                  name: countryName,
                },
              }))

            cityExist = await prisma.city.create({
              data: {
                name: googlePlaceCity.name,
                googlePlaceId: googlePlaceCity.place_id,
                lat: googlePlaceCity.geometry.location.lat(),
                lng: googlePlaceCity.geometry.location.lng(),
                countryId: countryId,
              },
            })
          }

          await prisma.school.update({
            where: {
              id,
            },
            data: {
              cityId: cityExist.id,
            },
          })
        }
      } else console.log('not predictions ' + googlePlaceId + ' ' + googlePlaceCityName)
    } else console.log('city name not found ' + googlePlaceId)
  })
}

main()
