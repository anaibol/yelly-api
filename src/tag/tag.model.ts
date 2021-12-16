import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'

@ObjectType()
export class Tag {
  @Field({ nullable: true })
  id: string

  @Field()
  text: string

  @Field({ nullable: true })
  createdAt: string

  @Field()
  isLive: boolean

  @Field(() => User, { nullable: true })
  author: User

  @Field(() => PaginatedPosts, { nullable: true })
  posts: PaginatedPosts
}
