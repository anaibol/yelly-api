import { Field, ObjectType } from '@nestjs/graphql'

import { Tag } from '../tag/tag.model'
import { User } from '../user/user.model'
import { PaginatedPosts } from './paginated-posts.model'
import { PostReaction } from './post-reaction.model'

@ObjectType()
export class PostPollOption {
  @Field(() => BigInt)
  id: bigint
  text?: string
  votesCount?: number
}
@ObjectType()
export class Post {
  @Field(() => BigInt)
  id: bigint
  text?: string
  charsCount?: number | null
  wordsCount?: number | null
  createdAt?: Date
  viewsCount?: number
  tags?: Tag[]
  author?: User
  pollOptions?: PostPollOption[]
  reactions?: PostReaction[]
  reactionsCount?: number
  authUserPollVote?: PostPollVote
  parent?: Post | null
  children?: PaginatedPosts
  childrenCount?: number
  authUserReaction?: PostReaction | null
  score?: number | null
}

@ObjectType()
export class PostPollVote {
  @Field(() => BigInt)
  id: bigint
  option?: PostPollOption
  post?: Post
}
