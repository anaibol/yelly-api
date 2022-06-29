import { ArgsType, Field } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

@ArgsType()
export class TrendArgs extends OffsetPaginationArgs {
  @Field(() => BigInt)
  tagId: bigint
}
