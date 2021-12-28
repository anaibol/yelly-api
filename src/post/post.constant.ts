export const postSelect = {
  _count: {
    select: {
      reactions: true,
      comments: true,
    },
  },
  id: true,
  createdAt: true,
  viewsCount: true,
  text: true,
  reactions: {
    select: {
      id: true,
      reaction: true,
      authorId: true,
      // distinct: 'reaction',
    },
    take: 2,
  },
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthdate: true,
      pictureId: true,
    },
  },
  tags: {
    select: {
      id: true,
      createdAt: true,
      text: true,
      isLive: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          pictureId: true,
        },
      },
    },
  },
}
