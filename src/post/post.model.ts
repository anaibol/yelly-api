import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { Tag } from '../tag/tag.model'
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
}

@ObjectType()
export class PostPollVote {
  @Field(() => ID)
  id: string
  option?: PostPollOption
  post?: Post
}
