/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '.prisma/client'
import algoliasearch from 'algoliasearch'
import { tagSelect } from 'src/tag/tag-select.constant'

const INDEX_NAME = process.env.ALGOLIA_INDEX_PREFIX + 'TAGS'

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
      select: {
        ...tagSelect,
        updatedAt: true,
      },
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
      return {
        id: tag.id,
        objectID: tag.id,
        text: tag.text,
        postCount: tag._count.posts,
        ...(tag.updatedAt && { updatedAtTimestamp: Date.parse(tag.updatedAt.toString()) }),
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }
    })

    //console.log(algoliaTags)

    userIndex.partialUpdateObjects(algoliaTags, { createIfNotExists: true })
  }
}

main()
