import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { UserIndexAlgoliaInterface } from '../../src/user/user-index-algolia.interface'
import { algoliaUserSelect, mapAlgoliaUser } from '../../src/utils/algolia'

async function main() {
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

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const userIndex = await algoliaClient.initIndex('dev_USERS')
    console.log('insert ' + skip)

    const algoliaUsers: UserIndexAlgoliaInterface[] = users.map((user) => mapAlgoliaUser(user))

    userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
  }
}

main()
