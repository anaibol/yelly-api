import { ArgsType } from '@nestjs/graphql'
import { DEFAULT_LIMIT } from './pagination.constant'

@ArgsType()
export class OffsetPaginationArgs {
  limit: number = DEFAULT_LIMIT
  skip?: number
}
