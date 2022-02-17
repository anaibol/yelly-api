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

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const friends = await prisma.friend.findMany({
      take: 500,
      skip: skip,
    })

    if (friends.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 500

    console.log('in progress: ' + skip)

    const usersMap = friends.map((friend) => {
      return [
        OgmUser.update({
          where: {
            id: friend.userId,
          },
          connect: {
            friends: [
              {
                where: {
                  node: {
                    id: friend.otherUserId,
                  },
                },
              },
            ],
          },
        }),
        OgmUser.update({
          where: {
            id: friend.otherUserId,
          },
          connect: {
            friends: [
              {
                where: {
                  node: {
                    id: friend.userId,
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
