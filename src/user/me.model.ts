import { ID, Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.model'
import { Post } from '../post/post.model'
import { School } from '../school/school.model'
import { Training } from './training.model'

@ObjectType()
export class Me {
  @Field(() => ID)
  id: string
  email?: string
  firstName?: string
  lastName?: string
  birthdate?: Date
  pictureId?: string
  avatar3dId?: string
  snapchat?: string
  instagram?: string
  isFilled?: boolean
  sendbirdAccessToken?: string
  about?: string
  locale?: string
  training?: Training
  school?: School
  posts?: Post[]
  followersCount?: number
  followeesCount?: number
  followees?: User[]
  followers?: User[]

  @Field({ defaultValue: 0 })
  unreadNotificationsCount: number
}
