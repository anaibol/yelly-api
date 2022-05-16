import { ArgsType } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TopTrendsByYearArgs extends OffsetPaginationArgs {
  isEmoji?: boolean
  postsAfter?: Date
  postsBefore?: Date
  postsAuthorBirthYear?: number
}
