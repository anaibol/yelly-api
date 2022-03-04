import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmUser, ogmTag } = await getNeo()

  let hasTags = true
  let skip = 0
  const take = 50

  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        authorId: true,
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

    const tagsMap = tags.map((tag) => {
      return [
        ogmTag.update({
          where: {
            id: tag.id,
          },
          connect: {
            author: {
              where: {
                node: {
                  id: tag.authorId,
                },
              },
            },
          },
        }),

        ogmUser.update({
          where: {
            id: tag.authorId,
          },
          connect: {
            tags: [
              {
                where: {
                  node: {
                    id: tag.id,
                  },
                },
              },
            ],
          },
        }),
      ]
    })

    const result = await Promise.all(tagsMap.flat())

    console.log('insert ' + skip)
  }
}

main()
