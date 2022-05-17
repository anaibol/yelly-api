import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { Post } from './post.model'

@ObjectType()
export class PostReaction {
  @Field(() => ID)
  id: string
  text?: string
  author?: User
  post?: Post
}
