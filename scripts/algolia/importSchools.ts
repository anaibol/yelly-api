/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { algoliaSchoolSelect } from '../../src/utils/algolia'

import 'dotenv/config'

const INDEX_NAME = 'dev_SCHOOLS'
const CHUNK_SIZE = 5000

const algoliaKey = process.env.ALGOLIA_API_KEY as string
const algoliaId = process.env.ALGOLIA_APP_ID as string
const prisma = new PrismaClient()

async function main() {
  const algoliaClient = await algoliasearch(algoliaId, algoliaKey)
  const userIndex = await algoliaClient.initIndex(INDEX_NAME)

  let hasSchools = true
  let skip = 0

  while (hasSchools) {
    const schools = await prisma.school.findMany({
      skip,
      take: CHUNK_SIZE,
      select: algoliaSchoolSelect,
    })

    if (schools.length == 0) {
      hasSchools = false
      console.log('finish')
      return
    }

    skip += CHUNK_SIZE
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

    userIndex.partialUpdateObjects(algoliaSchools, { createIfNotExists: true })
  }
}

main()
