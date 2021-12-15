import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { PostComment } from './post-comment.model'
import { PostReaction } from './post-reaction.model'
import { Tag } from './tag.model'

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

  @Field(() => [PostReaction])
  reactions: PostReaction[]

  @Field(() => Number)
  totalReactionsCount: number

  @Field(() => [PostComment], { nullable: true })
  comments: PostComment[]

  @Field(() => Number, { nullable: true })
  totalCommentsCount: number
}
