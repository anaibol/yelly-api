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
  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
      take: 500,
      skip: skip,
    })

    if (tags.length == 0) {
      hasTags = false
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

    const OgmTag = ogm.model('Tag')

    const tagsMap = tags.map((tag) => {
      return OgmTag.create({
        input: [
          {
            id: tag.id,
            text: tag.text,
            createdAt: tag.createdAt,
          },
        ],
      })
    })

    const result = await Promise.all(tagsMap.flat())

    console.log('insert ' + skip)
  }
}

main()
