import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string
  userSource: User
  user: User
  action: string
  isSeen?: boolean
  createdAt: Date
  itemId?: string
}
