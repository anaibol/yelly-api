import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
import { PostReaction } from 'src/post/post-reaction.model'
import { Post } from 'src/post/post.model'
import { FriendRequest } from 'src/user/friendRequest.model'

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  isSeen?: boolean
  createdAt: Date
  postReaction?: PostReaction | null
  friendRequest?: FriendRequest | null
  @Field(() => NotificationType)
  type?: NotificationType | null
  post?: Post | null
}
