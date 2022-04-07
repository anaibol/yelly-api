import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { Tag } from '../tag/tag.model'
import { PaginatedPosts } from './paginated-posts.model'

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
  emojis?: string[]
  author?: User
  pollOptions?: PostPollOption[]
  authUserPollVote?: PostPollVote
  expiresIn?: number | null
  expiresAt?: Date | null
  parent?: Post | null
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
