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
  while (hasPosts) {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        authorId: true,
        tags: {
          select: {
            id: true,
          },
        },
      },
      take: 500,
      skip: skip,
    })

    if (posts.length == 0) {
      hasPosts = false
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

    const OgmPost = ogm.model('Post')
    const OgmUser = ogm.model('User')
    const OgmTag = ogm.model('Tag')

    const postsMap = posts.map((post) => {
      return [
        OgmPost.update({
          where: {
            id: post.id,
          },
          connect: {
            author: {
              where: {
                node: {
                  id: post.authorId,
                },
              },
            },
            tags: [
              {
                where: {
                  node: {
                    id: post.tags[0].id,
                  },
                },
              },
            ],
          },
        }),
        OgmUser.update({
          where: {
            id: post.authorId,
          },
          connect: {
            posts: [
              {
                where: {
                  node: {
                    id: post.id,
                  },
                },
              },
            ],
          },
        }),

        OgmTag.update({
          where: {
            id: post.tags[0].id,
          },
          connect: {
            posts: [
              {
                where: {
                  node: {
                    id: post.id,
                  },
                },
              },
            ],
          },
        }),
      ]
    })

    const result = await Promise.all(postsMap.flat())

    console.log('insert ' + skip)
  }
}

main()
