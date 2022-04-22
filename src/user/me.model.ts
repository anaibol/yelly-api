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
  email?: string | null
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  birthdate?: Date | null
  pictureId?: string | null
  avatar3dId?: string | null
  snapchat?: string | null
  instagram?: string | null
  isFilled?: boolean
  sendbirdAccessToken?: string | null
  expoPushNotificationTokens?: string[]
  about?: string | null
  locale?: string
  training?: Training | null
  school?: School | null
  posts?: PaginatedPosts
  followers?: PaginatedUsers
  followees?: PaginatedUsers
  followersCount?: number
  followeesCount?: number
}
