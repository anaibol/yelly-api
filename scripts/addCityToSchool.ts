import { PrismaClient } from '.prisma/client'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { parse as uuidParse } from 'uuid'

const key = 'AIzaSyBohCYYvkdmFxcEd4qsqy3CkX-6FVqujPw'

async function main() {
  const prisma = new PrismaClient()

  const allSchools = await prisma.school.findMany({
    where: {
      NOT: [
        {
          googlePlaceId: '',
        },
      ],
      cityId: null,
      isValid: true,
    },
    select: {
      id: true,
      name: true,
      googlePlaceId: true,
    },
    take: 1000,
  })

  //console.log(allSchools)
  allSchools.map(async ({ id, googlePlaceId }) => {
    await prisma.school.update({
      where: {
        id,
      },
      data: {
        isValid: false,
      },
    })
    const googlePlaceCityName = await getCityNameWithCountry(googlePlaceId)

    console.log(googlePlaceId + ' ' + googlePlaceCityName)
    if (googlePlaceCityName) {
      const predictions = await getGoogleCityByName(googlePlaceCityName)

      if (predictions[0]) {
        const googlePlaceCity = await getGooglePlaceDetails(predictions[0].place_id)

        if (googlePlaceCity) {
          let cityExist = await prisma.city.findFirst({
            where: {
              googlePlaceId: googlePlaceCity.place_id,
            },
          })

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
                  id: mapStringIdToBuffer(randomUUID()),
                  name: countryName,
                },
              }))

            cityExist = await prisma.city.create({
              data: {
                id: mapStringIdToBuffer(randomUUID()),
                name: googlePlaceCity.name,
                googlePlaceId: googlePlaceCity.place_id,
                isValid: true,
                lat: googlePlaceCity.geometry.location.lat.toString(),
                lng: googlePlaceCity.geometry.location.lng.toString(),
                countryId: countryId,
              },
            })
          }

          console.log(googlePlaceId + ' ' + cityExist.name)
          await prisma.school.update({
            where: {
              id,
            },
            data: {
              cityId: cityExist.id,
              isValid: true,
            },
          })
        }
      }
    }
  })
}

function mapStringIdToBuffer(id: string): Buffer {
  return Buffer.from(uuidParse(id))
}

async function getCityNameWithCountry(googlePlaceId: string): Promise<string> {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )

  if (response.data.status == 'INVALID_REQUEST' || typeof response.data.result == 'undefined') return null
  const { address_components: addressComponents } = response.data.result.address_components

  const locality = addressComponents.find((component) => component.types.includes('locality'))
  const postal_town = addressComponents.find((component) => component.types.includes('postal_town'))

  return locality || postal_town
}

async function getGooglePlaceDetails(googlePlaceId: string) {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )

  return response.data.result as google.maps.places.PlaceResult | null
}

async function getGoogleCityByName(cityName: string) {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
    params: {
      types: '(cities)',
      language: 'fr',
      input: cityName,
      key: key,
    },
  })
  return data.predictions as google.maps.places.AutocompletePrediction[]
}

main()
