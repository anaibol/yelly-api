import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { UserIndexAlgoliaInterface } from 'src/user/interfaces/user-index-algolia.interface'
import { stringify as uuidStringify } from 'uuid'

async function main() {
  const prisma = new PrismaClient()

  //todo
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
  })

  const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

  const userIndex = await algoliaClient.initIndex('dev_USERS')
  //userIndex.clearObjects()

  const algoliaUsers: UserIndexAlgoliaInterface[] = users.map((user) => {
    console.log(user.email)

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

  console.log(algoliaUsers)

  userIndex.partialUpdateObjects(algoliaUsers, { createIfNotExists: true })
}

function getSchoolAndTraining(userTraining) {
  if (!userTraining) return

  const { training, school } = userTraining

  const algoliaTraining = training && {
    id: training.id,
    name: training.name,
  }

  console.log(school.name)

  const algoliaSchool = school && {
    id: school.id,
    name: school.name,
    postalCode: school.postalCode,
    googlePlaceId: school.googlePlaceId,
    city: {
      id: uuidStringify(school.city.id),
      name: school.city.name,
      googlePlaceId: school.city.googlePlaceId,

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
