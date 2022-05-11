import { ArgsType, Field } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TopTrendsArgs extends OffsetPaginationArgs {
  isEmoji?: boolean
  postsAfter?: Date
  postsBefore?: Date
  postsAuthorBirthYear?: number
}
