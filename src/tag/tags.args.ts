import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'

export enum TagSortBy {
  createdAt = 'createdAt',
  postCount = 'postCount',
  reactionsCount = 'reactionsCount',
  score = 'score',
  rank = 'rank',
}

registerEnumType(TagSortBy, {
  name: 'TagSortBy',
})

@ArgsType()
export class TagsArgs extends CursorPaginationArgs {
  isYesterday: boolean = false
  shouldIncludeExpired: boolean = false
  isForYou: boolean = false
  showHidden: boolean = false
  @Field(() => TagSortBy)
  sortBy?: TagSortBy = TagSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
  authorId?: string
}

@ArgsType()
export class TagsByRankArgs extends OffsetPaginationArgs {
  isYesterday: boolean = false
  isForYou: boolean = false
  shouldIncludeExpired: boolean = false
}
