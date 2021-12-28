import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PostReaction } from 'src/post/post-reaction.model'
import { User } from '../user/user.model'

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  userSource: User
  user: User
  type: string
  isSeen?: boolean
  createdAt: Date
  itemId?: string

  @Field(() => PostReaction, { nullable: true })
  postReaction?: PostReaction
}
