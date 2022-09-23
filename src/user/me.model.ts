import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
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
  displayName?: string | null
  username?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  instagram?: string | null
  snapchat?: string | null
  tiktok?: string | null
  isFilled?: boolean
  expoPushNotificationTokens?: string[]
  about?: string | null
  locale?: string
  countryId?: string | null
  followersCount?: number
  followeesCount?: number
  postCount?: number
  tagCount?: number
  viewsCount?: number
  tagViewsCount?: number
}
