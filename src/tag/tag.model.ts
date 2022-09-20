import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql'
import { TagType } from '@prisma/client'
import { User } from 'src/user/user.model'

import { PaginatedPosts } from '../post/paginated-posts.model'
import { TagReaction } from './tag-reaction.model'

registerEnumType(TagType, {
  name: 'TagType',
})

@ObjectType()
export class Tag {
  @Field(() => BigInt)
  id: bigint
  nanoId?: string | null
  text: string
  @Field(() => TagType)
  type?: TagType
  createdAt?: Date
  expiresAt?: Date | null
  isHidden?: boolean
  posts?: PaginatedPosts
  postCount?: number
  reactionsCount?: number
  viewsCount?: number
  interactionsCount?: number
  author?: User | null
  authUserReaction?: TagReaction | null
  isReadOnly?: boolean
  isPublic?: boolean
  @Field(() => Float)
  score?: number | null
  hasBeenTrending?: boolean
  @Field(() => Float)
  scoreFactor?: number | null
}
