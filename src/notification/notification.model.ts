import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType } from '@prisma/client'
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
  followRequest?: FollowRequest | null
  @Field(() => NotificationType)
  type?: NotificationType | null
}
