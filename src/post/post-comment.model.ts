import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'

@ObjectType()
export class PostComment {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  authorId: string
  author: User
}
