import { Field, ID, ObjectType } from '@nestjs/graphql'
import { City } from 'src/user/city.model'
import { User } from 'src/user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class School {
  @Field(() => ID)
  id: string
  name?: string
  googlePlaceId?: string
  lat?: string
  lng?: string
  city?: City
  totalUsersCount?: number
  posts?: PaginatedPosts
  users?: User[]
}
