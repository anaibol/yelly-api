import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { algoliaTagSelect } from '../../src/utils/algolia'

const INDEX_NAME = 'dev_TAGS'
const CHUNK_SIZE = 5000

const algoliaKey = process.env.ALGOLIA_API_KEY as string
const algoliaId = process.env.ALGOLIA_APP_ID as string
const prisma = new PrismaClient()

async function main() {
  const algoliaClient = await algoliasearch(algoliaId, algoliaKey)
  const userIndex = await algoliaClient.initIndex(INDEX_NAME)

  let hasTags = true
  let skip = 0

  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: algoliaTagSelect,
      skip,
      take: CHUNK_SIZE,
    })

    if (tags.length == 0) {
      hasTags = false
      console.log('finish')
      return
    }

    skip += CHUNK_SIZE

    console.log('insert ' + skip)
    const algoliaTags = tags.map((tag) => {
      const lastPost = tag.posts[0]

      const lastUsers = tag.posts.map((post) => post.author)
      return {
        id: tag.id,
        objectID: tag.id,
        text: tag.text,
        lastUsers: [...lastUsers],
        postCount: tag._count.posts,
        createdAtTimestamp: Date.parse(tag.createdAt.toString()),
        updatedAtTimestamp: Date.parse(lastPost.createdAt.toString()),
        createdAt: tag.createdAt,
        updatedAt: lastPost.createdAt,
      }
    })

    //console.log(algoliaTags)

    userIndex.partialUpdateObjects(algoliaTags, { createIfNotExists: true })
  }
}

main()
