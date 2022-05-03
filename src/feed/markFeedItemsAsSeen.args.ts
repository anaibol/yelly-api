import { ArgsType } from '@nestjs/graphql'

@ArgsType()
export class MarkFeedItemsAsSeenArgs {
  after?: Date
  before?: Date
  feedItemId?: string
}
