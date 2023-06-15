/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import algoliasearch from 'algoliasearch'

import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import { PrismaClient } from '.prisma/client'

const INDEX_NAME = process.env.ALGOLIA_INDEX_PREFIX + 'USERS'

const CHUNK_SIZE = 15000

const algoliaKey = process.env.ALGOLIA_API_KEY as string
const algoliaId = process.env.ALGOLIA_APP_ID as string
const prisma = new PrismaClient()

async function main() {
  const algoliaClient = await algoliasearch(algoliaId, algoliaKey)
  const userIndex = await algoliaClient.initIndex(INDEX_NAME)

  let hasUsers = true
  let skip = 0

  while (hasUsers) {
    // eslint-disable-next-line functional/no-try-statement
    try {
      const users = await prisma.user.findMany({
        where: {
          isFilled: true,
          NOT: {
            trainingId: null,
            schoolId: null,
          },
        },
        select: algoliaUserSelect,
        take: CHUNK_SIZE,
        skip,
      })
      if (users.length == 0) {
        hasUsers = false
        console.log('finish')
        return
      }
      skip += CHUNK_SIZE

      console.log('insert ' + skip)

      const algoliaUsers = users.map(mapAlgoliaUser)

      await userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
    } catch (error) {
      console.log(error)
    }
  }
}

main()
