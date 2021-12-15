import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'

@ObjectType()
export class PostComment {
  @Field({ nullable: true })
  id: string

  @Field()
  text: string

  @Field({ nullable: true })
  createdAt: string

  @Field(() => String)
  authorId: string

  @Field(() => User)
  author: User
}
