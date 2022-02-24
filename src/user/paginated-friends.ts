import { ArgsType } from '@nestjs/graphql'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'

@ArgsType()
export class FriendsArgs extends CursorPaginationArgs {
  tag?: string
  userId?: string
}
