import { PrismaClient } from '.prisma/client'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { parse as uuidParse } from 'uuid'

const key = 'AIzaSyBohCYYvkdmFxcEd4qsqy3CkX-6FVqujPw'

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
          let cityExist = await prisma.city.findFirst({
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
                  id: randomUUID(),
                  name: countryName,
                },
              }))

            cityExist = await prisma.city.create({
              data: {
                id: randomUUID(),
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

async function getCityNameWithCountry(googlePlaceId: string): Promise<string> {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )

  if (response.data.status == 'INVALID_REQUEST' || typeof response.data.result == 'undefined') return null
  const { address_components: addressComponents } = response.data.result

  const cityName = getCityName(addressComponents)

  return cityName + getCountryName(addressComponents)
}

async function getGooglePlaceDetails(googlePlaceId: string) {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )

  return response.data.result as google.maps.places.PlaceResult | null
}

async function getGoogleCityByName(cityName: string): Promise<google.maps.GeocoderResult> {
  const { data } = await axios.get<google.maps.GeocoderResponse>('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      language: 'fr',
      address: cityName,
      key: key,
    },
  })

  return data.results[0]
}

type AddressComponents = {
  country: string
  locality: string
  postal_town: string
  administrative_area_level_3: string
  administrative_area_level_2: string
  administrative_area_level_1: string
}

function getAddressComponents(addressComponents: google.maps.GeocoderAddressComponent[]): AddressComponents {
  const country = addressComponents.find((component) => component.types.includes('country'))
  const locality = addressComponents.find((component) => component.types.includes('locality'))
  const postal_town = addressComponents.find((component) => component.types.includes('postal_town'))

  const administrative_area_level_3 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_3')
  )

  const administrative_area_level_2 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_2')
  )
  const administrative_area_level_1 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_1')
  )

  return {
    country: country?.long_name,
    locality: locality?.long_name,
    postal_town: postal_town?.long_name,
    administrative_area_level_3: administrative_area_level_3?.long_name,
    administrative_area_level_2: administrative_area_level_2?.long_name,
    administrative_area_level_1: administrative_area_level_1?.long_name,
  }
}

function getCityName(addressComponents: google.maps.GeocoderAddressComponent[]): string {
  const {
    locality,
    postal_town,
    administrative_area_level_3,
    administrative_area_level_2,
    administrative_area_level_1,
  } = getAddressComponents(addressComponents)

  const administrativeArea = administrative_area_level_3 || administrative_area_level_2 || administrative_area_level_1

  if (locality) return locality + ' ' + administrativeArea

  if (postal_town) return postal_town + ' ' + administrativeArea

  return administrativeArea
}

function getCountryName(addressComponents: google.maps.GeocoderAddressComponent[]): string {
  const { country } = getAddressComponents(addressComponents)

  return country
}

main()
