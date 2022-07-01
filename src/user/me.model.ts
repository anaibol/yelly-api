import { ID, Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { School } from '../school/school.model'
import { Training } from './training.model'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { UserRole } from '@prisma/client'

registerEnumType(UserRole, {
  name: 'UserRole',
})

@ObjectType()
export class Me {
  @Field(() => ID)
  id: string
  @Field(() => UserRole)
  role: UserRole
  createdAt?: Date | null
  email?: string | null
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  snapchat?: string | null
  instagram?: string | null
  isFilled?: boolean
  expoPushNotificationTokens?: string[]
  about?: string | null
  locale?: string
  training?: Training | null
  school?: School | null
  countryId?: string | null
  posts?: PaginatedPosts
  followers?: PaginatedUsers
  followees?: PaginatedUsers
  followersCount?: number
  followeesCount?: number
  postCount?: number
  viewsCount?: number
  isAgeApproved?: boolean
  canCreateTag?: boolean
}

@ObjectType()
export class AgeVerificationResult {
  isAgeApproved: boolean
  ageEstimation?: number
  agePredictionResult?: null | string
}

export type AgePredictionResult = 'real' | 'fake' | 'undetermined'
