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

  let hasTags = true
  let skip = 0
  const take = 50
  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
      take: take,
      skip: skip,
    })

    if (tags.length == 0) {
      hasTags = false
      console.log('finish')
      return
    }
    skip += take

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

    const OgmTag = ogm.model('Tag')

    const tagsMap = tags.map((tag) => {
      return {
        id: tag.id,
        text: tag.text,
        createdAt: tag.createdAt,
      }
    })

    await OgmTag.create({
      input: tagsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
