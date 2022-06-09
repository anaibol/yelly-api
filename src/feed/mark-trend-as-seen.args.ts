import { ArgsType } from '@nestjs/graphql'
@ArgsType()
export class MarkTrendAsSeenArgs {
  tagId: string
  cursor: string
}
