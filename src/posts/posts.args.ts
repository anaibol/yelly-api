import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'

export enum PostsSortBy {
  createdAt = 'createdAt',
  childrenCount = 'childrenCount',
  reactionsCount = 'reactionsCount',
}

registerEnumType(PostsSortBy, {
  name: 'PostsSortBy',
})

@ArgsType()
export class PostsArgs extends CursorPaginationArgs {
  authorId?: string
  tagNanoId?: string
  @Field(() => BigInt)
  tagId?: bigint
  @Field(() => PostsSortBy)
  sortBy?: PostsSortBy = PostsSortBy.reactionsCount
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}
