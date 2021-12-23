import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string
  text: string
  createdAt: string
  isLive: boolean
  author?: User
  posts?: PaginatedPosts
}
