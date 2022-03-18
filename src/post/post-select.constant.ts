export const PostSelect = {
  id: true,
  createdAt: true,
  viewsCount: true,
  text: true,
  poll: {
    select: {
      id: true,
      options: {
        select: {
          id: true,
          text: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
    },
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
          lat: true,
          lng: true,
          city: {
            select: {
              id: true,
              name: true,
              country: {
                select: {
                  id: true,
                  code: true,
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
    },
  },
}
