export const tagSelect = {
  id: true,
  nanoId: true,
  text: true,
  type: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  expiresAt: true,
  isHidden: true,
  viewsCount: true,
  shareCount: true,
  interactionsCount: true,
  score: true,
  scoreFactor: true,
  _count: {
    select: {
      posts: true,
      members: true,
    },
  },
  author: {
    select: {
      id: true,
      displayName: true,
      username: true,
      pictureId: true,
    },
  },
}
