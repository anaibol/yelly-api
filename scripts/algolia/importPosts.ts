/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { PostSelect } from '../../src/post/post-select.constant'
import { mapAlgoliaPost, PostIndexAlgoliaInterface } from '../../src/utils/algolia'

const INDEX_NAME = process.env.ALGOLIA_INDEX_PREFIX + 'POSTS'

const prisma = new PrismaClient()

async function main() {
  let hasPosts = true
  let skip = 0

  while (hasPosts) {
    const posts = await prisma.post.findMany({
      select: PostSelect,
      take: 500,
      skip,
    })

    if (!posts) return Promise.reject(new Error('No post found'))

    if (posts.length == 0) {
      hasPosts = false
      console.log('finish')
      return
    }

    skip += 500
    const algoliaClient = await algoliasearch(
      process.env.ALGOLIA_APP_ID as string,
      process.env.ALGOLIA_API_KEY as string
    )
    const postIndex = await algoliaClient.initIndex(INDEX_NAME)
    console.log('insert ' + skip)

    const algoliaPosts = posts.map(mapAlgoliaPost).filter((v) => v)
    postIndex.partialUpdateObjects(algoliaPosts as PostIndexAlgoliaInterface[], { createIfNotExists: true })
  }
}

main()
