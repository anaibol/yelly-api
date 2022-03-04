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
  const take = 50
  while (hasUsers) {
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

    //console.log('in progress: ' + skip)

    const usersMap = users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureId: user.pictureId,
      }
    })

    await OgmUser.create({
      input: usersMap,
    })

    console.log('insert ' + skip)
  }
}

main()
