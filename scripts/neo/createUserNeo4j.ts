import { OGM } from '@neo4j/graphql-ogm'
import { PrismaClient } from '@prisma/client'
import { createDriver } from '../../src/neo/createDriver'
import { typeDefs } from '../../src/neo'
import { ModelMap } from '../../src/generated/ogm-types'

import 'dotenv/config'

async function main() {
  const prisma = new PrismaClient()

  const neoUri = process.env.NEO4J_URI as string
  const neoUser = process.env.NEO4J_USER as string
  const neoPassword = process.env.NEO4J_PASSWORD as string

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const date = new Date('2022-02-15T14:13:46.158Z')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        createdAt: true,
      },
      where: {
        isFilled: true,
        createdAt: {
          gt: date.toISOString(),
        },
      },
      take: 5000,
      skip: skip,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 5000

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

    const usersMap = users.map((user) => {
      return OgmUser.create({
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

    await Promise.all(usersMap)
    console.log('insert ' + skip)
  }
}

main()
