import { ArgsType } from '@nestjs/graphql'
import { Max } from 'class-validator'
import { DEFAULT_LIMIT, MAX_LIMIT } from './pagination.constant'

@ArgsType()
export class OffsetPaginationArgs {
  skip: number = 0

  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT
}
