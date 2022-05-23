import { ArgsType } from '@nestjs/graphql'
import { BigIntCursorPaginationArgs } from 'src/common/big-int-cursor-pagination.args'

@ArgsType()
export class FeedArgs extends BigIntCursorPaginationArgs {
  isSeen?: boolean
}
