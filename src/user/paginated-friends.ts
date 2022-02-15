import { ArgsType } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination.args'

@ArgsType()
export class FriendsArgs extends PaginationArgs {
  tag?: string
  userId?: string
}
