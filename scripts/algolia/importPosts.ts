/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { PostSelect } from '../../src/post/post-select.constant'
import { mapAlgoliaPost, PostIndexAlgoliaInterface } from '../../src/utils/algolia'

async function main() {
  const prisma = new PrismaClient()
  const INDEX_NAME = 'dev_POSTS'

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
    const algoliaClient = await algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const postIndex = await algoliaClient.initIndex(INDEX_NAME)
    console.log('insert ' + skip)

    const algoliaPosts = posts.map(mapAlgoliaPost).filter((v) => v)
    postIndex.partialUpdateObjects(algoliaPosts as PostIndexAlgoliaInterface[], { createIfNotExists: true })
  }
}

main()
