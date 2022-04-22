import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { FollowRequestStatus } from '@prisma/client'
import { User } from './user.model'

// eslint-disable-next-line functional/no-expression-statement
registerEnumType(FollowRequestStatus, {
  name: 'FollowRequestStatus',
})

@ObjectType()
export class FollowRequest {
  @Field(() => ID)
  id: string
  fromUser?: User
  toUser?: User
  @Field(() => FollowRequestStatus)
  status?: FollowRequestStatus
}
