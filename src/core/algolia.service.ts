import { Injectable } from '@nestjs/common'
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch'

@Injectable()
export class AlgoliaService {
  client: SearchClient
  indexPrefix = process.env.ALGOLIA_INDEX_PREFIX

  constructor() {
    this.client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  }

  initIndex(indexName: string) {
    return this.client.initIndex(this.indexPrefix + indexName)
  }

  saveObject(index: SearchIndex, objectToAdd: any, objectID: string) {
    return index.saveObject({
      ...objectToAdd,
      objectID,
    })
  }

  async deleteObject(index: SearchIndex, objectId: string): Promise<boolean> {
    await index.deleteObject(objectId)

    return true
  }

  partialUpdateObject(index: SearchIndex, objectToUpdate: any, objectID: string) {
    return index.partialUpdateObject(
      {
        objectID,
        ...objectToUpdate,
      },
      {
        createIfNotExists: true,
      }
    )
  }

  partialUpdateObjects(index: SearchIndex, objectsToUpdate: Array<Record<string, any>>) {
    return index.partialUpdateObjects(objectsToUpdate)
  }
}
