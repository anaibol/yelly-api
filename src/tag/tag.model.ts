import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  posts?: PaginatedPosts
  postCount?: number
  authUserPosted?: boolean
}
