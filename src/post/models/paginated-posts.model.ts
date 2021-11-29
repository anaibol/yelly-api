import { Field, ObjectType } from '@nestjs/graphql'
import { Post } from './post.model'

@ObjectType()
export class PaginatedPosts {
  @Field()
  nextCursor: string

  @Field(() => [Post])
  items: Post[]
}
