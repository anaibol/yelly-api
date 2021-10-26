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

// const tagsIndex = client.initIndex(indexPrefix + 'tags');
// tagsIndex.addObject(
//   {
//     lastUsers: [
//       {
//         pictureId: 'am3enjn3',
//       },
//     ],
//     postCount: 1,
//     _createdAt: Math.round(ad.createdAt.getTime()),
//   },
//   tag.text,
// );
// tagsIndex
//   .partialUpdateObject({
//     objectID: tag.text,
//     postCount: 6565323,
//     lastUsers: [
//       {
//         pictureId: 'am3enjn3',
//       },
//     ],
//   })
//   .then((e) => console.log(e))
//   .catch((e) => {
//     console.error(e);
//   });
