import { ArgsType } from '@nestjs/graphql'
@ArgsType()
export class MarkTrendAsSeenArgs {
  before: Date
  tagId: string
}
