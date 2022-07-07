import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'

import { School } from '../school/school.model'
import { Training } from './training.model'

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
  followersCount?: number
  followeesCount?: number
  postCount?: number
  tagCount?: number
  viewsCount?: number
  isAgeApproved?: null | boolean
}

@ObjectType()
export class AgeVerificationResult {
  isAgeApproved?: null | boolean
  ageEstimation?: number
  agePredictionResult?: null | string
}

export type AgePredictionResult = 'real' | 'fake' | 'undetermined'
