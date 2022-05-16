import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
import { PostReaction } from 'src/post/post-reaction.model'
import { FollowRequest } from 'src/user/follow-request.model'

registerEnumType(NotificationType, {
  name: 'NotificationType',
})

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  isSeen?: boolean
  createdAt: Date
  followRequest?: FollowRequest | null
  postReaction?: PostReaction | null
  @Field(() => NotificationType)
  type?: NotificationType | null
}
