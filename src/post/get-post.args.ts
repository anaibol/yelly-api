import { ArgsType, Field } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination.args'

@ArgsType()
export class GetPostsArgs extends PaginationArgs {
  @Field({ nullable: true })
  tag?: string
  @Field({ nullable: true })
  userId?: string
}
