import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'

async function main() {
  const INDEX_NAME = 'dev_CITIES'
  const prisma = new PrismaClient()

  let hasCities = true
  let skip = 0
  while (hasCities) {
    const cities = await prisma.city.findMany({
      include: {
        country: true,
      },
      skip: skip,
      take: 500,
    })

    if (cities.length == 0) {
      hasCities = false
      console.log('finish')
      return
    }
    skip += 500
    console.log('insert ' + skip)
    const algoliaCities = cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        country: {
          id: city.countryId,
          name: city.country.name,
        },
        googlePlaceId: city.googlePlaceId,
        _geoloc: {
          lat: city.lat,
          lng: city.lng,
        },
        objectID: city.id,
      }
    })

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const userIndex = await algoliaClient.initIndex(INDEX_NAME)
    userIndex.partialUpdateObjects(algoliaCities, { createIfNotExists: true })
  }
}

main()
