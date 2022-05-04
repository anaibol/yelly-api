import { ArgsType, Field } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TopTrendsArgs extends OffsetPaginationArgs {
  isEmoji: boolean
  isLive: boolean
  postsAfter: Date
  postsBefore: Date
}
