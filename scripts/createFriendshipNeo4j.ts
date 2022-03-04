import { OGM } from '@neo4j/graphql-ogm'
import { PrismaClient } from '@prisma/client'
import { ModelMap } from 'src/generated/ogm-types'
import { createDriver } from 'src/neo/createDriver'
import { typeDefs } from '../src/neo'

async function main() {
  const prisma = new PrismaClient()

  const neoUri = 'neo4j+s://d6b7f265.databases.neo4j.io'
  const neoUser = 'neo4j'
  const neoPassword = 'XIn3Gn5e5NRRTVUmTN7dikrukr6zlNkft7CCXqsITuo'

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

    friends.forEach((friend) => {
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
      })
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
      })
    })
  }
}

main()
