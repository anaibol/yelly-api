import { PrismaClient } from '.prisma/client'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { parse as uuidParse, stringify as uuidStringify } from 'uuid'

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
    },
    select: {
      id: true,
      name: true,
      googlePlaceId: true,
    },
    take: 300,
  })

  allSchools.map(async ({ id, googlePlaceId }) => {
    const googlePlaceCityName = await getCityNameWithCountry(googlePlaceId)

    if (googlePlaceCityName) {
      const predictions = await getGoogleCityByName(googlePlaceCityName)

      if (predictions[0]) {
        const googlePlaceCity = await getGooglePlaceDetails(predictions[0].place_id)

        if (googlePlaceCity) {
          const { id: cityId } =
            (await prisma.city.findFirst({
              where: {
                googlePlaceId: googlePlaceCity.place_id,
              },
            })) ||
            (await prisma.city.create({
              data: {
                id: mapStringIdToBuffer(randomUUID()),
                name: googlePlaceCity.name,
                googlePlaceId: googlePlaceCity.place_id,
                isValid: true,
                lat: googlePlaceCity.geometry.location.lat.toString(),
                lng: googlePlaceCity.geometry.location.lng.toString(),
              },
            }))

          await prisma.school.update({
            where: {
              id,
            },
            data: {
              cityId,
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
  const address_components = response.data.result.address_components

  let city: string
  let country: string

  address_components.map((component) => {
    if (component.types.includes('locality')) city = component.long_name
    if (component.types.includes('country')) country = component.long_name
  })
  return city + ' ' + country
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
