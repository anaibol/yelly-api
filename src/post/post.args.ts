import { ArgsType, Field } from '@nestjs/graphql'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'

@ArgsType()
export class PostArgs extends CursorPaginationArgs {
  @Field(() => BigInt)
  postId: bigint
}
