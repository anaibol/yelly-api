import { ArgsType, Field, Int } from '@nestjs/graphql'
import { DEFAULT_LIMIT } from './pagination.constant'

@ArgsType()
export class PaginationArgs {
  @Field({ nullable: true })
  after?: string

  @Field(() => Int)
  limit: number = DEFAULT_LIMIT
}
