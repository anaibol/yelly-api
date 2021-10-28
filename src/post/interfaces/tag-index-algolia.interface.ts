export interface TagIndexAlgoliaInterface {
  text: string;
  lastUsers: { pictureId: string; firstName: string }[];
  postCount: number | Object;
  createdAtTimestamp: number;
  updatedAtTimestamp: number;
  createdAt: Date;
  updatedAt: Date;
}
