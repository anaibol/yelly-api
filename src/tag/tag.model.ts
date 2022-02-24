import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  author?: User | null
  posts?: PaginatedPosts
  postCount?: number
  lastUsers?: User[]
}
