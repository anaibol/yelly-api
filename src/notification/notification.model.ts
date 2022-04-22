import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
import { PostReaction } from 'src/post/post-reaction.model'
import { Post } from 'src/post/post.model'
import { FollowRequest } from 'src/user/followRequest.model'

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
  followRequest?: FollowRequest | null
  @Field(() => NotificationType)
  type?: NotificationType | null
  post?: Post | null
}
