import { Injectable } from '@nestjs/common';
import algoliasearch from 'algoliasearch';

@Injectable()
export class AlgoliaService {
  client;
  indexPrefix = process.env.ALGOLIA_INDEX_PREFIX;
  constructor() {
    this.client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY,
    );
  }

  initIndex(indexName: string) {
    return this.client.initIndex(this.indexPrefix + indexName);
  }

  addObject(index: any, objectToAdd: any, objectID: any) {
    return index.addObject(
      {
        ...objectToAdd,
      },
      objectID,
    );
  }

  partialUpdateObject(index: any, objectToUpdate: any, objectID: any) {
    return index.partialUpdateObject(
      {
        objectID,
        ...objectToUpdate,
      },
      {
        createIfNotExists: true,
      },
    );
  }

  incrementValue(index: any, objectToUpdateOrCreate: any, objectID: any) {
    index.partialUpdateObject({
      ...objectToUpdateOrCreate,
      postCount: {
        _operation: 'Increment',
        value: 1,
      },
      objectID,
    });
  }
}
