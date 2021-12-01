export interface TagIndexAlgoliaInterface {
  id: string
  text: string
  lastUsers: { id: string; pictureId: string; firstName: string }[]
  postCount: number | object
  createdAtTimestamp: number
  updatedAtTimestamp: number
  createdAt: Date
  updatedAt: Date
}
