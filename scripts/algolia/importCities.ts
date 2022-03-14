import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'

const INDEX_NAME = 'dev_CITIES'
const CHUNK_SIZE = 5000

const algoliaKey = process.env.ALGOLIA_API_KEY as string
const algoliaId = process.env.ALGOLIA_APP_ID as string
const prisma = new PrismaClient()

async function main() {
  const algoliaClient = await algoliasearch(algoliaId, algoliaKey)
  const userIndex = await algoliaClient.initIndex(INDEX_NAME)

  let hasCities = true
  let skip = 0

  while (hasCities) {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
        lat: true,
        lng: true,
        country: true,
      },
      skip,
      take: CHUNK_SIZE,
    })

    if (cities.length == 0) {
      hasCities = false
      console.log('finish')
      return
    }

    skip += CHUNK_SIZE
    console.log('insert ' + skip)

    const algoliaCities = cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        country: {
          id: city.country.id,
          code: city.country.code,
        },
        googlePlaceId: city.googlePlaceId,
        _geoloc: {
          lat: city.lat,
          lng: city.lng,
        },
        objectID: city.id,
      }
    })

    userIndex.partialUpdateObjects(algoliaCities, { createIfNotExists: true })
  }
}

main()
