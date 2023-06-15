import { ArgsType, Field } from '@nestjs/graphql'
import { Max } from 'class-validator'

import { DEFAULT_LIMIT, MAX_LIMIT } from './pagination.constant'

@ArgsType()
export class CursorPaginationArgs {
  @Field(() => BigInt)
  after?: bigint

  @Max(MAX_LIMIT)
  limit: number = DEFAULT_LIMIT
}
