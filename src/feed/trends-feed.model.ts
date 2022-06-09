import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { Tag } from '../tag/tag.model'

@ObjectType()
class Trend {
  posts?: PaginatedPosts
  tag: Tag
}

@ObjectType()
export class TrendsFeed {
  nextSkip: number
  items: Trend[]
}
