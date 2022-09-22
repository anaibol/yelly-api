import { Prisma } from '@prisma/client'

export type UserIndexAlgoliaInterface = {
  id: string
  createdAt: Date
  objectID: string
  displayName: string | null
  username: string | null
  pictureId: string | null
  createdAtTimestamp: number | null
  hasPicture: boolean
}

export type PostIndexAlgoliaInterface = {
  id: string
  objectID: string
  text: string
  createdAt: Date
  createdAtTimestamp: number
  author: {
    id: string
    createdAt: Date
    displayName: string
    username: string
    pictureId: string | null
  }
  tags: {
    id: string
    createdAt: Date
    createdAtTimestamp: number
    text: string
  }[]
}

export const algoliaUserSelect = {
  id: true,
  createdAt: true,
  displayName: true,
  username: true,
  isFilled: true,
  isAgeApproved: true,
  pictureId: true,
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
      displayName: true,
      username: true,
      pictureId: true,
    },
  },
  tags: {
    select: {
      id: true,
      createdAt: true,
      text: true,
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
    displayName: user.displayName,
    username: user.username,
    pictureId: user.pictureId,
    createdAtTimestamp: user.createdAt ? Date.parse(user.createdAt.toString()) : null,
    hasPicture: user.pictureId != null,
  }
}

const algoliaPost = Prisma.validator<Prisma.PostArgs>()({
  select: algoliaPostSelect,
})

type AlgoliaPost = Prisma.PostGetPayload<typeof algoliaPost>

export function mapAlgoliaPost(post: AlgoliaPost): PostIndexAlgoliaInterface | null {
  const { id, createdAt, displayName, username, pictureId } = post.author

  if (!createdAt || !displayName || !username) return null

  return {
    id: post.id.toString(),
    objectID: post.id.toString(),
    createdAt: post.createdAt,
    createdAtTimestamp: post.createdAt.getTime(),
    text: post.text,
    author: {
      id,
      createdAt,
      displayName,
      username,
      pictureId,
    },
    tags: post.tags.map((tag) => {
      return {
        id: tag.id.toString(),
        createdAt: tag.createdAt,
        createdAtTimestamp: tag.createdAt.getTime(),
        text: tag.text,
      }
    }),
  }
}
