import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { algoliaTagSelect } from '../../src/utils/algolia'

async function main() {
  const INDEX_NAME = 'prod_TAGS'
  const prisma = new PrismaClient()

  let hasTags = true
  let skip = 0
  while (hasTags) {
    const tags = await prisma.tag.findMany({
      select: algoliaTagSelect,
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

    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const userIndex = await algoliaClient.initIndex(INDEX_NAME)
    userIndex.partialUpdateObjects(algoliaTags, { createIfNotExists: true })
  }
}

main()
