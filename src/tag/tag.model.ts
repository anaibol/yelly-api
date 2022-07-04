import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/user.model'

import { PaginatedPosts } from '../post/paginated-posts.model'
import { TagReaction } from './tag-reaction.model'

@ObjectType()
export class Tag {
  @Field(() => BigInt)
  id: bigint
  text: string
  createdAt?: Date
  isHidden?: boolean
  posts?: PaginatedPosts
  postCount?: number
  reactionsCount?: number
  viewsCount?: number
  author?: User | null
  authUserReaction?: TagReaction | null
}
