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

  let hasPosts = true
  let skip = 0
  const take = 50
  while (hasPosts) {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        authorId: true,
        text: true,
        createdAt: true,
        viewsCount: true,
        tags: {
          select: {
            id: true,
          },
        },
      },
      take: take,
      skip: skip,
    })

    if (posts.length == 0) {
      hasPosts = false
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

    const OgmPost = ogm.model('Post')

    const postsMap = posts.map((post) => {
      return {
        id: post.id,
        text: post.text,
        viewsCount: post.viewsCount,
        createdAt: post.createdAt,
      }
    })

    await OgmPost.create({
      input: postsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
