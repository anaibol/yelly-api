import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PostReaction } from 'src/post/post-reaction.model'
import { FriendRequest } from 'src/user/friendRequest.model'

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  isSeen?: boolean
  createdAt: Date
  postReaction?: PostReaction | null
  friendRequest?: FriendRequest | null
}
