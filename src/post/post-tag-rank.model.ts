import { Field, ObjectType } from '@nestjs/graphql'
import { Tag } from '../tag/tag.model'
import { Post } from '../post/post.model'

@ObjectType()
export class PostTagRank {
  @Field(() => BigInt)
  id: BigInt
  tag?: Tag
  post?: Post
  score?: number
  position?: number | null
  previousPosition?: number | null
}
