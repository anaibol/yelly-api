import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../user/models/user.model'
import { Post } from './post.model'

@ObjectType()
export class Tag {
  @Field()
  id: string

  @Field()
  text: string

  @Field()
  createdAt: string

  @Field()
  isLive: boolean

  @Field(() => User)
  author: User

  @Field(() => [Post])
  posts: Post[]
}
