import { ArgsType, Field } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TopTrendsArgs extends OffsetPaginationArgs {
  @Field({ nullable: true })
  isEmoji: boolean = false
  @Field({ nullable: true })
  postsAfter: Date
  @Field({ nullable: true })
  postsBefore: Date
}
