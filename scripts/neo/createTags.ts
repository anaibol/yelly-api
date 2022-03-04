import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmTag } = await getNeo()

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

    const tagsMap = tags.map((tag) => {
      return ogmTag.create({
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
