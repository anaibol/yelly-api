import { ArgsType } from '@nestjs/graphql'
import { DEFAULT_LIMIT } from './pagination.constant'

@ArgsType()
export class PaginationArgs {
  after?: string
  limit: number = DEFAULT_LIMIT
}
