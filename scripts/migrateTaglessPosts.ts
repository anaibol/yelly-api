/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '.prisma/client'
const pAll = require('p-all')

async function main() {
  const prisma = new PrismaClient()

  const noTag = await prisma.tag.findUnique({
    where: {
      text: 'NoTag',
    },
  })

  const posts = await prisma.post.findMany({
    where: {
      tags: {
        none: {},
      },
    },
  })

  const updatePost = (post: any) => {
    return async () => {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          tags: {
            connect: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              id: noTag!.id,
            },
          },
        },
      })

      console.log(post.text)
    }
  }

  const actions = posts.map(updatePost)

  await pAll(actions, { concurrency: 5 })

  console.log(posts.length)
}

main()
