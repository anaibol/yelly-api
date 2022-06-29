import { ArgsType, Field } from '@nestjs/graphql'
@ArgsType()
export class MarkTrendAsSeenArgs {
  @Field(() => BigInt)
  tagId: bigint
  cursor: string
}
