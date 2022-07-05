import { Field, ID, ObjectType } from '@nestjs/graphql'

import { School } from '../school/school.model'
import { Training } from './training.model'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string
  createdAt?: Date | null
  firstName?: string | null
  lastName?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  snapchat?: string | null
  instagram?: string | null
  about?: string | null
  locale?: string | null
  training?: Training | null
  school?: School | null
  countryId?: string | null
  isFollowedByAuthUser?: boolean
  followersCount?: number
  followeesCount?: number
  postCount?: number
  viewsCount?: number
}
