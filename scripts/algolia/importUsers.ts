import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { stringify as uuidStringify } from 'uuid'
import { UserIndexAlgoliaInterface } from '../../src/user/user-index-algolia.interface'

import { algoliaUserSelect } from '../../src/utils/algolia'

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

    const algoliaUsers: UserIndexAlgoliaInterface[] = users.map((user) => ({
      id: uuidStringify(Buffer.from(user.id)),
      objectID: uuidStringify(Buffer.from(user.id)),
      lastName: user.lastName,
      firstName: user.firstName,
      birthdateTimestamp: user.birthdate ? Date.parse(user.birthdate.toString()) : null,
      hasPicture: user.pictureId != null,
      training: {
        id: uuidStringify(Buffer.from(user.training.id)),
        name: user.training.name,
      },
      school: {
        id: uuidStringify(Buffer.from(user.school.id)),
        name: user.school.name,
        postalCode: user.school.postalCode,
        googlePlaceId: user.school.googlePlaceId,
        city: {
          id: uuidStringify(Buffer.from(user.school.city.id)),
          name: user.school.city.name,
          googlePlaceId: user.school.city.googlePlaceId,
          country: {
            id: uuidStringify(Buffer.from(user.school.city.country.id)),
            name: user.school.city.country.name,
          },
          _geoloc: {
            lat: user.school.city.lat,
            lng: user.school.city.lng,
          },
        },
        _geoloc: {
          lat: user.school.lat,
          lng: user.school.lng,
        },
      },
    }))

    userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
  }
}

main()
