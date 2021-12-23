import { ID, Field, ObjectType } from '@nestjs/graphql'
import { Post } from '../post/post.model'
import { School } from './school.model'
import { Training } from './training.model'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string
  firstName?: string
  lastName?: string
  birthdate?: Date
  pictureId?: string
  avatar3dId?: string
  snapchat?: string
  instagram?: string
  about?: string
  locale?: string
  training?: Training
  school?: School
  posts?: Post[]
  followersCount?: number
  followeesCount?: number
  followees?: User[]
  followers?: User[]
  isFollowingAuthUser?: boolean
}
