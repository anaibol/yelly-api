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

export const algoliaUserSelect = {
  id: true,
  createdAt: true,
  displayName: true,
  username: true,
  isFilled: true,
  isAgeApproved: true,
  pictureId: true,
}

const user = Prisma.validator<Prisma.UserArgs>()({
  select: algoliaUserSelect,
})

type User = Prisma.UserGetPayload<typeof user>

export function mapAlgoliaUser(user: User): UserIndexAlgoliaInterface {
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
