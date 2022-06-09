import { ArgsType } from '@nestjs/graphql'
import { Max } from 'class-validator'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'
import { DEFAULT_LIMIT, MAX_LIMIT } from '../common/pagination.constant'

@ArgsType()
export class TrendsFeedArgs extends OffsetPaginationArgs {
  @Max(MAX_LIMIT)
  postLimit: number = DEFAULT_LIMIT
}
