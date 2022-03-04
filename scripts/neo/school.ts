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

  const modelNeo4j = ogm.model('School')
  let hasItems = true
  let skip = 0
  const take = 50
  while (hasItems) {
    const items = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
        lat: true,
        lng: true,
        cityId: true,
      },
      take: take,
      skip: skip,
    })

    if (items.length == 0) {
      hasItems = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const itemsMap = items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        googlePlaceId: item.googlePlaceId,
        lat: item.lat,
        lng: item.lng,
        city: {
          connect: {
            where: {
              node: {
                id: item.cityId,
              },
            },
          },
        },
      }
    })

    await modelNeo4j.create({
      input: itemsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
