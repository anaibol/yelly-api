export const PostSelect = {
  id: true,
  createdAt: true,
  viewsCount: true,
  text: true,
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
          city: {
            select: {
              id: true,
              name: true,
              country: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
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
