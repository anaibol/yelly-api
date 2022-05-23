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
  requester?: User
  toFollowUser?: User
  @Field(() => FollowRequestStatus)
  status?: FollowRequestStatus
}
