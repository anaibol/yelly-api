import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { PostComment } from './post-comment.model'
import { PostPoll } from './post-poll.model'
import { Tag } from '../tag/tag.model'

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string
  text?: string
  createdAt?: Date
  viewsCount?: number
  tags?: Tag[]
  author?: User
  comments?: PostComment[]
  poll?: PostPoll
}
