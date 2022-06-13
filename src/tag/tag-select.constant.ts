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
    },
  },
}
