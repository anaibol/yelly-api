import { ObjectType } from '@nestjs/graphql'
import { Trend } from './trend.model'

@ObjectType()
export class PaginatedTrends {
  nextSkip: number
  items: Trend[]
}
