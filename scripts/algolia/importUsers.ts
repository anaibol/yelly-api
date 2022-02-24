import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'
import 'dotenv/config'

async function main() {
  const algoliaKey = process.env.ALGOLIA_API_KEY as string
  const algoliaId = process.env.ALGOLIA_APP_ID as string
  const prisma = new PrismaClient()

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: {
        isFilled: true,
        NOT: {
          trainingId: null,
          schoolId: null,
        },
      },
      select: algoliaUserSelect,
      take: 500,
      skip: skip,
    })
    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 500

    const algoliaClient = await algoliasearch(algoliaId, algoliaKey)
    const userIndex = await algoliaClient.initIndex('prod_USERS')
    console.log('insert ' + skip)

    const algoliaUsers = users.map((user) => mapAlgoliaUser(user))

    await userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
  }
}

main()
