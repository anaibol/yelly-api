import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql'
import { TagType } from '@prisma/client'
import { User } from 'src/user/user.model'

import { PaginatedPosts } from '../post/paginated-posts.model'

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
  viewsCount?: number
  interactionsCount?: number
  author?: User | null
  isReadOnly?: boolean
  isPublic?: boolean
  @Field(() => Float)
  score?: number | null
  @Field(() => Float)
  scoreFactor?: number | null
  membersCount?: number | null
  shareCount?: number | null
}
