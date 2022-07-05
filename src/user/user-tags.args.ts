import { ArgsType, Field } from '@nestjs/graphql'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { SortDirection, TagSortBy } from '../tag/tags.args'

@ArgsType()
export class UserTagsArgs extends CursorPaginationArgs {
  userId: string
  @Field(() => TagSortBy)
  sortBy?: TagSortBy = TagSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}
