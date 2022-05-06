import { ArgsType, Field } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TrendsArgs extends OffsetPaginationArgs {
  @Field({ nullable: true })
  isEmoji: boolean = false
}
