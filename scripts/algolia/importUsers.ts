import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { UserIndexAlgoliaInterface } from 'src/user/interfaces/user-index-algolia.interface'
import { stringify as uuidStringify } from 'uuid'

/**
 * TODO :
 *  1 - add country in city
 *  2 - pagination
 */
async function main() {
  const prisma = new PrismaClient()

  const countUser = await prisma.user.count({
    where: {
      NOT: {
        userTraining: null,
      },
    },
  })

  let paginate = true
  let skip = 0
  while (paginate) {
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

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

    const userIndex = await algoliaClient.initIndex('dev_USERS')

    const algoliaUsers: UserIndexAlgoliaInterface[] = users.map((user) => {
      const schoolAndTraining = getSchoolAndTraining(user.userTraining)

      return {
        id: uuidStringify(user.id),
        objectID: uuidStringify(user.id),
        lastName: user.lastName,
        firstName: user.firstName,
        birthdateTimestamp: Date.parse(user.birthdate.toString()),
        hasPicture: user.pictureId != null,
        school: schoolAndTraining.algoliaSchool,
        training: schoolAndTraining.algoliaTraining,
      }
    })

    userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })

    if (skip > countUser) paginate = false
    skip += 500
  }
}

function getSchoolAndTraining(userTraining) {
  if (!userTraining) return

  const { training, school } = userTraining

  const algoliaTraining = training && {
    id: training.id,
    name: training.name,
  }
  const algoliaSchool = school && {
    id: school.id,
    name: school.name,
    postalCode: school.postalCode,
    googlePlaceId: school.googlePlaceId,
    city: {
      id: uuidStringify(school.city.id),
      name: school.city.name,
      googlePlaceId: school.city.googlePlaceId,
      country: {
        id: school.city.country.id,
        name: school.city.country.name,
      },
      _geoloc: {
        lat: parseInt(school.city.lat),
        lng: parseInt(school.city.lng),
      },
    },
    _geoloc: {
      lat: parseInt(school.lat),
      lng: parseInt(school.lng),
    },
  }

  return { algoliaSchool, algoliaTraining }
}

main()
