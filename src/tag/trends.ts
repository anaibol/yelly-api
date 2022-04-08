import { ArgsType } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TrendsArgs extends OffsetPaginationArgs {
  isEmoji: boolean = false
}
