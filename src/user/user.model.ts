import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Training } from './training.model'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string
  createdAt?: Date | null
  displayName?: string | null
  username?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  instagram?: string | null
  snapchat?: string | null
  tiktok?: string | null
  about?: string | null
  locale?: string | null
  training?: Training | null
  countryId?: string | null
  isFollowedByAuthUser?: boolean
  hasBlockedAuthUser?: boolean
  isBlockedByAuthUser?: boolean
  isBanned?: boolean | null
  isAgeApproved?: boolean | null
  followersCount?: number
  followeesCount?: number
  postCount?: number
  tagCount?: number
  viewsCount?: number
  tagViewsCount?: number
}
