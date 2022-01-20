export type UserIndexAlgoliaInterface = {
  id: string
  objectID: string
  firstName: string
  lastName: string
  pictureId: string
  createdAtTimestamp: number
  birthdateTimestamp: number
  hasPicture: boolean
  training: {
    id: string
    name: string
  }
  school: {
    id: string
    name: string
    googlePlaceId: string
    city: {
      id: string
      name: string
      googlePlaceId: string
      country?: {
        id: string
        name: string
      }
      _geoloc: {
        lat: number
        lng: number
      }
    }
    _geoloc: {
      lat: number
      lng: number
    }
  }
}

export const algoliaUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  isFilled: true,
  pictureId: true,
  birthdate: true,
  createdAt: true,
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
      googlePlaceId: true,
      lat: true,
      lng: true,
      city: {
        select: {
          id: true,
          name: true,
          googlePlaceId: true,
          lat: true,
          lng: true,
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
}

export const algoliaTagSelect = {
  id: true,
  text: true,
  createdAt: true,
  _count: {
    select: {
      posts: true,
    },
  },
  author: {
    select: {
      id: true,
      pictureId: true,
      firstName: true,
      lastName: true,
    },
  },
  posts: {
    select: {
      createdAt: true,
      author: {
        select: {
          id: true,
          pictureId: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    take: 5,
    distinct: 'authorId' as const,
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
}

export function mapAlgoliaUser(user): UserIndexAlgoliaInterface {
  return {
    id: user.id,
    objectID: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    pictureId: user.pictureId,
    birthdateTimestamp: user.birthdate ? Date.parse(user.birthdate.toString()) : null,
    createdAtTimestamp: user.createdAt ? Date.parse(user.createdAt.toString()) : null,
    hasPicture: user.pictureId != null,
    training: {
      id: user.training.id,
      name: user.training.name,
    },
    school: {
      id: user.school.id,
      name: user.school.name,
      googlePlaceId: user.school.googlePlaceId,
      city: {
        id: user.school.city.id,
        name: user.school.city.name,
        googlePlaceId: user.school.city.googlePlaceId,
        country: {
          id: user.school.city.country.id,
          name: user.school.city.country.name,
        },
        _geoloc: {
          lat: user.school.city.lat,
          lng: user.school.city.lng,
        },
      },
      _geoloc: {
        lat: user.school.lat,
        lng: user.school.lng,
      },
    },
  }
}
