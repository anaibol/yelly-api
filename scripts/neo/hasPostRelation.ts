import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmUser, ogmPost, ogmTag } = await getNeo()

  let hasPosts = true
  let skip = 0
  const take = 50

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

    const postsMap = posts.map((post) => {
      return [
        ogmPost.update({
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
        ogmUser.update({
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

        ogmTag.update({
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
