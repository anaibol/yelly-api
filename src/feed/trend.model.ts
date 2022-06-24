import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { Post } from '../post/post.model'

@ObjectType()
export class Trend {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  isEmoji?: boolean
  posts?: OffsetPaginatedPosts
  postCount?: number
  author?: User | null
  nextCursor?: string
  score?: number | null
  firstPost?: Post | null
}

@ObjectType()
export class PaginatedTrends {
  nextSkip: number
  items: Trend[]
}

@ObjectType()
class OffsetPaginatedPosts {
  nextSkip: number
  items: Post[]
}
