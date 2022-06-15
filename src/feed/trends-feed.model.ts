import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class Trend {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  isEmoji?: boolean
  posts?: PaginatedPosts
  postCount?: number
  author?: User
  nextCursor?: string
  @Field(() => Float)
  score?: number | null
}

@ObjectType()
export class TrendsFeed {
  nextSkip: number
  items: Trend[]
}
