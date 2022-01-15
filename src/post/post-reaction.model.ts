import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'

@ObjectType()
export class PostReaction {
  @Field(() => ID)
  id: string
  createdAt?: Date
  reaction: string
  postId?: string
  author?: User
}
