import { Field, ObjectType } from '@nestjs/graphql'

import { Tag } from './tag.model'

@ObjectType()
export class PaginatedTags {
  @Field(() => BigInt)
  nextCursor: bigint | null
  items: Tag[]
  totalCount: number
}

@ObjectType()
export class PaginatedTagsByScore {
  nextSkip?: number | null
  items: Tag[]
  totalCount: number
}
