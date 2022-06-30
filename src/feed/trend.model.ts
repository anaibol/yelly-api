import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { Post } from '../post/post.model'
import { TagReaction } from '../tag/tag-reaction.model'

@ObjectType()
export class Trend {
  @Field(() => BigInt)
  id: bigint
  text: string
  createdAt?: Date
  posts?: OffsetPaginatedPosts
  postCount?: number
  reactionsCount?: number
  viewsCount?: number
  author?: User | null
  nextCursor?: string
  score?: number | null
  authUserReaction?: TagReaction | null
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
