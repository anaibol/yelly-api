import { ObjectType } from '@nestjs/graphql'

import { Tag } from './tag.model'

@ObjectType()
export class PaginatedTags {
  nextSkip: number
  items: Tag[]
}
