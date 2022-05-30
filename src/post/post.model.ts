import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { Tag } from '../tag/tag.model'
import { PostTagRank } from './post-tag-rank.model'
import { PaginatedPosts } from './paginated-posts.model'
import { PostReaction } from './post-reaction.model'

@ObjectType()
export class PostPollOption {
  @Field(() => ID)
  id: string
  text?: string
  votesCount?: number
}
@ObjectType()
export class Post {
  @Field(() => ID)
  id: string
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
  expiresIn?: number | null
  expiresAt?: Date | null
  parent?: Post | null
  threadId?: string | null
  children?: PaginatedPosts
  childrenCount?: number
  authUserReaction?: PostReaction | null
}

@ObjectType()
export class PostPollVote {
  @Field(() => ID)
  id: string
  option?: PostPollOption
  post?: Post
}
