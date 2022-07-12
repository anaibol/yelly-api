export interface TagIndexAlgoliaInterface {
  id: BigInt
  text: string
  postCount: number | object
  reactionsCount: number | object
  date: Date
  dateTimestamp: number
  createdAt: Date
  createdAtTimestamp: number
  updatedAt?: Date
  updatedAtTimestamp?: number
}
