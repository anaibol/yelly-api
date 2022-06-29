export const tagSelect = {
  id: true,
  text: true,
  createdAt: true,
  isLive: true,
  isEmoji: true,
  isHidden: true,
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
    },
  },
}
