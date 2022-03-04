import { OGM } from '@neo4j/graphql-ogm'
import { PrismaClient } from '@prisma/client'
import { ModelMap } from 'src/generated/ogm-types'
import { createDriver } from '../../src/neo/createDriver'
import { typeDefs } from '../../src/neo'
import 'dotenv/config'

async function main() {
  const prisma = new PrismaClient()

  const neoUri = process.env.NEO4J_URI as string
  const neoUser = process.env.NEO4J_USER as string
  const neoPassword = process.env.NEO4J_PASSWORD as string

  const driver = await createDriver({
    uri: neoUri,
    user: neoUser,
    password: neoPassword,
  })

  const ogm = new OGM<ModelMap>({
    typeDefs,
    driver: driver,
  })

  const OgmUser = ogm.model('User')
  const OgmSchool = ogm.model('School')
  const OgmTraining = ogm.model('Training')

  let hasUsers = true
  let skip = 0
  const take = 50
  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: {
        isFilled: true,
      },
      select: {
        id: true,
        schoolId: true,
        trainingId: true,
      },
      take: take,
      skip: skip,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const usersMap = users.map((user) => {
      return [
        OgmUser.update({
          where: {
            id: user.id,
          },
          connect: {
            training: {
              where: {
                node: {
                  id: user.trainingId,
                },
              },
            },
            school: {
              where: {
                node: {
                  id: user.schoolId,
                },
              },
            },
          },
        }),

        OgmSchool.update({
          where: {
            id: user.schoolId,
          },
          connect: {
            users: [
              {
                where: {
                  node: {
                    id: user.id,
                  },
                },
              },
            ],
          },
        }),

        OgmTraining.update({
          where: {
            id: user.trainingId,
          },
          connect: {
            users: [
              {
                where: {
                  node: {
                    id: user.id,
                  },
                },
              },
            ],
          },
        }),
      ]
    })

    await Promise.all(usersMap.flat())
    console.log('insert ' + skip)
  }
}

main()
