import { ArgsType, Field, Int } from '@nestjs/graphql'
import { DEFAULT_LIMIT } from '../constants/pagination.constant'

@ArgsType()
export class PaginationArgs {
  @Field({ nullable: true })
  after?: string

  @Field(() => Int)
  limit: number = DEFAULT_LIMIT
}
