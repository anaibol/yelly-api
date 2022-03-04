import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmPost } = await getNeo()

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

    const postsMap = posts.map((post) => {
      return {
        id: post.id,
        text: post.text,
        viewsCount: post.viewsCount,
        createdAt: post.createdAt,
      }
    })

    await ogmPost.create({
      input: postsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
