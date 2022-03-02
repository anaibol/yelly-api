import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { algoliaSchoolSelect } from '../../src/utils/algolia'

async function main() {
  const INDEX_NAME = 'dev_SCHOOLS'
  const prisma = new PrismaClient()

  let hasSchools = true
  let skip = 0
  while (hasSchools) {
    const schools = await prisma.school.findMany({
      skip: skip,
      take: 500,
      select: algoliaSchoolSelect,
    })

    if (schools.length == 0) {
      hasSchools = false
      console.log('finish')
      return
    }

    skip += 500
    console.log('insert ' + skip)

    const algoliaSchools = schools.map((school) => {
      return {
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
        objectID: school.id,
      }
    })

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const userIndex = await algoliaClient.initIndex(INDEX_NAME)
    userIndex.partialUpdateObjects(algoliaSchools, { createIfNotExists: true })
  }
}

main()
