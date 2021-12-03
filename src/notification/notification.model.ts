import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'

@ObjectType()
export class Notification {
  @Field()
  id: string

  @Field(() => User)
  userSource: User

  @Field(() => User)
  user: User

  @Field()
  action: string

  @Field()
  isSeen?: boolean

  @Field()
  createdAt: Date

  @Field({ nullable: true })
  itemId?: string
}
