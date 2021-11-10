import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/models/user.model'

@ObjectType()
export class Notification {
  @Field()
  id: string

  @Field((type) => User)
  userSource: User

  @Field((type) => User)
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
