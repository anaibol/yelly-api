import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Post } from 'src/post/post.model'

@ObjectType()
class TagWithPost {
  @Field(() => ID)
  id: string
  text: string
  createdAt?: Date
  isLive?: boolean
  isEmoji?: boolean
  post?: Post
}

@ObjectType()
export class PaginatedTopTrends {
  nextSkip: number
  items: TagWithPost[]
}
