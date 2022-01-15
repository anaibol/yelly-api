export const PostSelect = {
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
      author: {
        select: {
          id: true,
        },
      },
    },
    distinct: 'reaction' as const,
    take: 2,
  },
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthdate: true,
      pictureId: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
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
