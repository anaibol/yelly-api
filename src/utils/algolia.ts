import { Prisma } from '@prisma/client'

export type UserIndexAlgoliaInterface = {
  id: string
  objectID: string
  firstName: string | null
  lastName: string | null
  pictureId: string | null
  createdAtTimestamp: number | null
  birthdateTimestamp: number | null
  hasPicture: boolean
  training: {
    id?: string
    name?: string
  }
  school: {
    id?: string
    name?: string
    googlePlaceId?: string | null
    city: {
      id?: string
      name?: string
      googlePlaceId?: string | null
      country: {
        id?: string
        code?: string
      }
      _geoloc: {
        lat?: number | null
        lng?: number | null
      }
    }
    _geoloc: {
      lat?: number | null
      lng?: number | null
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
              code: true,
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

export const algoliaSchoolSelect = {
  id: true,
  name: true,
  googlePlaceId: true,
  lat: true,
  lng: true,
  _count: {
    select: {
      users: true,
    },
  },
  city: {
    select: {
      id: true,
      name: true,
      lat: true,
      lng: true,
      country: {
        select: {
          id: true,
          code: true,
        },
      },
    },
  },
}

const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
  select: algoliaUserSelect,
})

type UserWithPosts = Prisma.UserGetPayload<typeof userWithPosts>

export function mapAlgoliaUser(user: UserWithPosts): UserIndexAlgoliaInterface {
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
      id: user.training?.id,
      name: user.training?.name,
    },
    school: {
      id: user.school?.id,
      name: user.school?.name,
      googlePlaceId: user.school?.googlePlaceId,
      city: {
        id: user.school?.city.id,
        name: user.school?.city.name,
        googlePlaceId: user.school?.city?.googlePlaceId,
        country: {
          id: user.school?.city.country.id,
          code: user.school?.city.country.code,
        },
        _geoloc: {
          lat: user.school?.city?.lat,
          lng: user.school?.city?.lng,
        },
      },
      _geoloc: {
        lat: user.school?.lat,
        lng: user.school?.lng,
      },
    },
  }
}
