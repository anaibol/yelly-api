export const tagSelect = {
  id: true,
  nanoId: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  isHidden: true,
  viewsCount: true,
  _count: {
    select: {
      posts: true,
      reactions: true,
    },
  },
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
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
