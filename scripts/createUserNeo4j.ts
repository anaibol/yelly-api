import { OGM } from '@neo4j/graphql-ogm'
import { PrismaClient } from '@prisma/client'
import { createDriver } from '../src/neo/createDriver'
import { typeDefs } from '../src/neo'
import { ModelMap } from 'src/generated/ogm-types'

async function main() {
  const prisma = new PrismaClient()

  const neoUri = 'neo4j+s://d6b7f265.databases.neo4j.io'
  const neoUser = 'neo4j'
  const neoPassword = 'XIn3Gn5e5NRRTVUmTN7dikrukr6zlNkft7CCXqsITuo'

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
      },
      where: {
        isFilled: true,
      },
      take: 500,
      skip,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 500

    console.log('in progress: ' + skip)

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

    users.forEach(async (user) => {
      await OgmUser.create({
        input: [
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            pictureId: user.pictureId,
          },
        ],
      })
    })
  }
}

main()
