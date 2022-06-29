import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { Post } from '../post/post.model'

@ObjectType()
export class Trend {
  @Field(() => BigInt)
  id: BigInt
  text: string
  createdAt?: Date
  isLive?: boolean
  isEmoji?: boolean
  posts?: OffsetPaginatedPosts
  postCount?: number
  reactionsCount?: number
  viewsCount?: number
  author?: User | null
  nextCursor?: string
  score?: number | null
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
