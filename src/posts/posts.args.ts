import { ArgsType, Field } from '@nestjs/graphql'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'

@ArgsType()
export class PostsArgs extends CursorPaginationArgs {
  authorId?: string
  @Field(() => BigInt)
  tagId?: bigint
}
