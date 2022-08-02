import { Field, ObjectType } from '@nestjs/graphql'

import { Tag } from './tag.model'

@ObjectType()
export class PaginatedTags {
  @Field(() => BigInt)
  nextCursor: BigInt | null
  items: Tag[]
  totalCount: number
}

@ObjectType()
export class PaginatedTagsByScore {
  nextSkip?: number
  items: Tag[]
  totalCount: number
}
