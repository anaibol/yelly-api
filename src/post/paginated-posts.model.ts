import { Field, ObjectType } from '@nestjs/graphql'
import { Post } from './post.model'

@ObjectType()
export class PaginatedPosts {
  nextCursor: string
  items: Post[]
}
