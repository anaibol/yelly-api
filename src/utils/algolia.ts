import { Prisma } from '@prisma/client'

export type UserIndexAlgoliaInterface = {
  id: string
  createdAt: Date
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

export type PostIndexAlgoliaInterface = {
  id: string
  objectID: string
  text: string
  author: {
    id: string
    createdAt: Date
    firstName: string
    lastName: string
    birthdate: string
    pictureId: string | null
    school: {
      id: string
      name: string
      lat: number | null
      lng: number | null
      city: {
        id: string
        name: string
        country: {
          id: string
          code: string
        }
      }
    }
    training: {
      id: string
      name: string
    }
  }
  tags: {
    id: string
    createdAt: Date
    text: string
    isEmoji: boolean
  }[]
  createdAt: Date
}

export const algoliaUserSelect = {
  id: true,
  createdAt: true,
  firstName: true,
  lastName: true,
  isFilled: true,
  pictureId: true,
  birthdate: true,
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
  training: {
    select: {
      id: true,
      name: true,
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

export const algoliaPostSelect = {
  id: true,
  text: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      createdAt: true,
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
      training: {
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
      isEmoji: true,
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
    createdAt: user.createdAt,
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

const algoliaPost = Prisma.validator<Prisma.PostArgs>()({
  select: algoliaPostSelect,
})

type AlgoliaPost = Prisma.PostGetPayload<typeof algoliaPost>

export function mapAlgoliaPost(post: AlgoliaPost): PostIndexAlgoliaInterface | null {
  const { id, createdAt, firstName, lastName, birthdate, pictureId, school, training } = post.author

  if (!createdAt || !firstName || !lastName || !birthdate || !lastName || !school?.city?.country || !training)
    return null

  return {
    id: post.id,
    objectID: post.id,
    createdAt: post.createdAt,
    text: post.text,
    author: {
      id,
      createdAt,
      firstName,
      lastName,
      birthdate: birthdate.toDateString(),
      pictureId,
      school: {
        id: school.id,
        name: school.name,
        lat: school.lat,
        lng: school.lng,
        city: {
          id: school.city.id,
          name: school.city.name,
          country: {
            id: school.city.country.id,
            code: school.city.country.code,
          },
        },
      },
      training: {
        id: training.id,
        name: training.name,
      },
    },
    tags: post.tags.map((tag) => {
      return {
        id: tag.id,
        createdAt: tag.createdAt,
        text: tag.text,
        isEmoji: tag.isEmoji,
      }
    }),
  }
}
