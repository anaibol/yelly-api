import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmTag } = await getNeo()

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
      take,
      skip,
    })

    if (tags.length == 0) {
      hasTags = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const tagsMap = tags.map((tag) => {
      return {
        id: tag.id,
        text: tag.text,
        createdAt: tag.createdAt,
      }
    })

    await ogmTag.create({
      input: tagsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
