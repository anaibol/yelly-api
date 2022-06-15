/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '.prisma/client'
const pAll = require('p-all')

async function main() {
  const prisma = new PrismaClient()

  const tags = await prisma.tag.findMany({
    // where: {
    //   authorId: null,
    // },
    include: {
      posts: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  console.log({ tags: tags.length })

  const actions = tags.map((tag) => {
    return async () => {
      if (tag.posts.length > 0) {
        await prisma.tag.update({
          where: {
            id: tag.id,
          },
          data: {
            author: {
              connect: {
                id: tag.posts[0].authorId,
              },
            },
          },
        })
      } else {
        await prisma.tag.delete({
          where: {
            id: tag.id,
          },
        })
      }

      console.log(tag.text)
    }
  })

  await pAll(actions, { concurrency: 5 })
}

main()
