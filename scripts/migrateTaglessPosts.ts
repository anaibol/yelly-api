/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const posts = await prisma.post.findMany({
    where: {
      tags: {
        none: {},
      },
    },
  })

  posts.forEach(async (post) => {
    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        tags: {
          connect: {
            id: '2844624934859178940',
          },
        },
      },
    })
  })

  console.log(posts.length)
}

main()
