import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string
  createdAt?: Date | null
  lastLoginAt?: Date | null
  displayName?: string | null
  username?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  instagram?: string | null
  snapchat?: string | null
  tiktok?: string | null
  about?: string | null
  locale?: string | null
  countryId?: string | null
  isFollowedByAuthUser?: boolean
  hasBlockedAuthUser?: boolean
  isBlockedByAuthUser?: boolean
  isBanned?: boolean | null
  followersCount?: number
  followeesCount?: number
  postCount?: number
  tagCount?: number
  viewsCount?: number
  tagViewsCount?: number
}
