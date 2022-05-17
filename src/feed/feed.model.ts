import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { FeedItemType } from '@prisma/client'
import { Post } from 'src/post/post.model'

registerEnumType(FeedItemType, {
  name: 'FeedItemType',
})

@ObjectType()
export class FeedItem {
  @Field(() => BigInt)
  id: bigint
  post?: Post
  createdAt?: Date
  @Field(() => FeedItemType)
  type?: FeedItemType | null
}

@ObjectType()
export class Feed {
  nextCursor: string
  items: FeedItem[]
  totalCount: number
}
