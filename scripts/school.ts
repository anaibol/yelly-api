import { PrismaClient } from '.prisma/client'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { parse as uuidParse, stringify as uuidStringify } from 'uuid'

const key = 'AIzaSyBohCYYvkdmFxcEd4qsqy3CkX-6FVqujPw'
async function main() {
  const prisma = new PrismaClient()

  const allSchools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
      googlePlaceid: true,
    },
  })

  allSchools.map(async (school) => {
    const place_id = school.googlePlaceid
    const city_name = await getSchoolByPlaceById(place_id)

    if (city_name) {
      const googleCity = await getGoogleCityByName(city_name)

      if (googleCity.predictions[0]) {
        const cityInGoogle = (await getCityByPlaceId(googleCity.predictions[0].place_id)).result

        let cityInDB = await prisma.city.findFirst({
          where: {
            googlePlaceid: cityInGoogle.place_id,
          },
        })

        if (!cityInDB) {
          cityInDB = await prisma.city.create({
            data: {
              id: mapStringIdToBuffer(randomUUID()),
              name: cityInGoogle.name,
              googlePlaceid: cityInGoogle.place_id,
              isValid: true,
              lat: cityInGoogle.geometry.location.lat.toString(),
              lng: cityInGoogle.geometry.location.lng.toString(),
            },
          })
        }

        await prisma.school.update({
          where: {
            id: school.id,
          },
          data: {
            cityId: cityInDB.id,
          },
        })
      }
    }
  })

  /*

  console.log(city)
  /*allSchools.map(async (school) => {
    // api google get place delail
    // or every school get place details from google places api with l
    // find city by name "Paris, France" on google places autocomplete api to get the city googlePlaceId
    // search city on our db by  googlePlaceId and create it it doesn't exist
    // assign the cityId  to the schoole googlePlaceId
  })*/
}
function mapSchoolBufferIdToUUID(schools) {
  return schools.map((school) => {
    const schoolWithUUID = {
      ...school,
    }
    schoolWithUUID.id = mapBufferIdToString(school.id)
    return schoolWithUUID
  })
}

function mapBufferIdToString(id: Buffer): string {
  let uuid = ''
  try {
    uuid = uuidStringify(id)
  } catch {
    console.log('uuid : ' + id)
  }
  return uuid
}

function mapStringIdToBuffer(id: string): Buffer {
  return Buffer.from(uuidParse(id))
}

async function getSchoolByPlaceById(googlePlaceId: string) {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )
  if (response.data.status == 'INVALID_REQUEST') return null
  const address_components = response.data.result.address_components
  let city: string
  let country: string
  address_components.map((component) => {
    if (component.types.includes('locality')) city = component.long_name
    if (component.types.includes('country')) country = component.long_name
  })
  return city + ' ' + country
}

async function getCityByPlaceId(googlePlaceId: string) {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' + googlePlaceId + '&key=' + key
  )

  return response.data
}

async function getGoogleCityByName(cityName: string) {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
    params: {
      types: '(cities)',
      language: 'fr',
      input: cityName,
      key: key,
    },
  })

  return response.data
}

main()
