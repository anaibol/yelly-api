import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { skip } from 'rxjs'
import { UserIndexAlgoliaInterface } from 'src/user/interfaces/user-index-algolia.interface'
import { stringify as uuidStringify } from 'uuid'

async function main() {
  const prisma = new PrismaClient()

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          userTraining: null,
        },
      },
      include: {
        userTraining: {
          include: {
            training: true,
            school: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },
      },
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
    const algoliaUsers = []
    users
      .filter(
        (user) =>
          user.userTraining &&
          user.userTraining.school &&
          user.userTraining.school.city &&
          user.userTraining.school.city.country
      )
      .forEach((user) => {
        const { school, training } = user.userTraining

        algoliaUsers.push({
          id: uuidStringify(Buffer.from(user.id)),
          objectID: uuidStringify(Buffer.from(user.id)),
          lastName: user.lastName,
          firstName: user.firstName,
          birthdateTimestamp: Date.parse(user.birthdate.toString()),
          hasPicture: user.pictureId != null,
          school: formatSchool(school),
          training: formatTraining(training),
        })
      })

    userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
  }
}

function formatSchool(school) {
  return {
    id: uuidStringify(Buffer.from(school.id)),
    name: school.name,
    postalCode: school.postalCode,
    googlePlaceId: school.googlePlaceId,
    city: {
      id: uuidStringify(Buffer.from(school.city.id)),
      name: school.city.name,
      googlePlaceId: school.city.googlePlaceId,
      country: {
        id: uuidStringify(Buffer.from(school.city.country.id)),
        name: school.city.country.name,
      },
      _geoloc: {
        lat: parseFloat(school.city.lat),
        lng: parseFloat(school.city.lng),
      },
    },
    _geoloc: {
      lat: parseFloat(school.lat),
      lng: parseFloat(school.lng),
    },
  }
}

function formatTraining(training) {
  return {
    id: uuidStringify(Buffer.from(training.id)),
    name: training.name,
  }
}
main()
