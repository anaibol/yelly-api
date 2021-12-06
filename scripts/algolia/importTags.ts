import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { stringify as uuidStringify } from 'uuid'

async function main() {
  const INDEX_NAME = 'dev_TAGS'
  const prisma = new PrismaClient()

  let hasTags = true
  let skip = 0
  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        text: true,
        createdAt: true,
        posts: {
          select: {
            author: {
              select: {
                id: true,
                pictureId: true,
                firstName: true,
              },
            },
            createdAt: true,
          },
          take: 5,
          distinct: 'authorId',
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      skip: skip,
      take: 500,
    })

    if (tags.length == 0) {
      hasTags = false
      console.log('finish')
      return
    }
    skip += 500
    console.log('insert ' + skip)
    const algoliaTags = tags.map((tag) => {
      const lastPost = tag.posts[0]

      const lastUsers = mapAuthorBufferIdToUUID(tag.posts)
      return {
        id: tag.id,
        objectID: tag.id,
        text: tag.text,
        lastUsers: [...lastUsers],
        postCount: tag.posts.length,
        createdAtTimestamp: Date.parse(tag.createdAt.toString()),
        updatedAtTimestamp: Date.parse(lastPost.createdAt.toString()),
        createdAt: tag.createdAt,
        updatedAt: lastPost.createdAt,
      }
    })

    //console.log(algoliaTags)

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const userIndex = await algoliaClient.initIndex(INDEX_NAME)
    userIndex.partialUpdateObjects(algoliaTags, { createIfNotExists: true })
  }
}

function mapAuthorBufferIdToUUID(posts) {
  return posts.map((post) => {
    const authorWithUUID = {
      ...post.author,
    }
    authorWithUUID.id = uuidStringify(Buffer.from(post.author.id))

    return authorWithUUID
  })
}

main()