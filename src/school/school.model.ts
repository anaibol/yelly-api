import { Field, ObjectType } from '@nestjs/graphql'
import { City } from 'src/user/city.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class School {
  @Field({ nullable: true })
  id: string
  name?: string
  googlePlaceId?: string
  lat?: string
  lng?: string
  city?: City
  totalUsersCount: number
  posts?: PaginatedPosts
}
