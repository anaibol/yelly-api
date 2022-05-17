import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class MarkFeedItemsAsSeenArgs {
  after?: Date
  before?: Date
  @Field(() => BigInt)
  feedItemId?: bigint
}
