import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'

import { Post } from './post.model'

@ObjectType()
export class PostReaction {
  @Field(() => BigInt)
  id: BigInt
  text?: string
  author?: User
  post?: Post
}
