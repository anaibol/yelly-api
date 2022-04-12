import { ObjectType } from '@nestjs/graphql'
import { Tag } from './tag.model'

@ObjectType()
export class PaginatedTrends {
  nextSkip: number
  items: Tag[]
}
