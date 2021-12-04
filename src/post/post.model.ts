import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { Tag } from './tag.model'

@ObjectType()
class Reaction {
  @Field()
  text: string

  @Field()
  reaction: string

  @Field()
  authorId: string
}

@ObjectType()
export class Post {
  @Field()
  id: string

  @Field()
  text: string

  @Field()
  createdAt: string

  @Field()
  viewsCount: number

  @Field(() => [Tag])
  tags: Tag[]

  @Field(() => User)
  author: User

  @Field(() => [Reaction])
  reactions: Reaction[]

  @Field(() => Number)
  totalReactions: number
}
