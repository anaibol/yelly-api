import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmPost } = await getNeo()

  let hasPosts = true
  let skip = 0
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

    const postsMap = posts.map((post) => {
      return ogmPost.create({
        input: [
          {
            id: post.id,
            text: post.text,
            viewsCount: post.viewsCount,
            createdAt: post.createdAt,
          },
        ],
      })
    })

    const result = await Promise.all(postsMap.flat())

    console.log('insert ' + skip)
  }
}

main()
