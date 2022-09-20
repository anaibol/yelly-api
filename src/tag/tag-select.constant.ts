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
  interactionsCount: true,
  hasBeenTrending: true,
  score: true,
  scoreFactor: true,
  _count: {
    select: {
      posts: true,
      reactions: true,
    },
  },
  author: {
    select: {
      id: true,
      displayName: true,
      username: true,
      birthdate: true,
      pictureId: true,
      training: {
        select: {
          id: true,
          name: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          city: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
}
