import { ArgsType } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination.args'

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  tag?: string
  userId?: string
  schoolId?: string
}
