import { ArgsType, Field } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { PostsSortBy } from '../posts/posts.args'

@ArgsType()
export class PostArgs extends CursorPaginationArgs {
  @Field(() => BigInt)
  postId: bigint
  @Field(() => PostsSortBy)
  childrenSortBy?: PostsSortBy = PostsSortBy.createdAt
  @Field(() => SortDirection)
  childrenSortDirection?: SortDirection = SortDirection.desc
}
