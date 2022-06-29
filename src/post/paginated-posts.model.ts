import { Field, ObjectType } from '@nestjs/graphql'
import { Post } from './post.model'

@ObjectType()
export class PaginatedPosts {
  @Field(() => BigInt)
  nextCursor: BigInt | null
  items: Post[]
}
