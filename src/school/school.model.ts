import { Field, ID, ObjectType, Float } from '@nestjs/graphql'
import { City } from 'src/user/city.model'
import { User } from 'src/user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class School {
  @Field(() => ID)
  id: string
  name?: string
  googlePlaceId?: string | null
  @Field(() => Float)
  lat?: number | null
  @Field(() => Float)
  lng?: number | null
  city?: City
  totalUsersCount?: number
  posts?: PaginatedPosts
  users?: User[]
  @Field(() => Float)
  distance?: number
}
