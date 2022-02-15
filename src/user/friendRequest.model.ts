import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { FriendRequestStatus } from '@prisma/client'
import { User } from './user.model'

registerEnumType(FriendRequestStatus, {
  name: 'FriendRequestStatus',
})

@ObjectType()
export class FriendRequest {
  @Field(() => ID)
  id: string
  fromUser?: User
  toUser?: User
  @Field(() => FriendRequestStatus)
  status?: FriendRequestStatus
}
