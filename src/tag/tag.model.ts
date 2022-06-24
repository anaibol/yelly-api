import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { Post } from '../post/post.model'

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  isEmoji?: boolean
  isHidden?: boolean
  posts?: PaginatedPosts
  postCount?: number
  author?: User | null
  firstPost?: Post | null
}
