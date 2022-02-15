export interface TagIndexAlgoliaInterface {
  id: string
  text: string
  lastUsers: { id: string; pictureId: string | null; firstName: string | null }[]
  postCount: number | object
  createdAtTimestamp: number
  // updatedAtTimestamp: number
  createdAt: Date
  // updatedAt: Date
}
