import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'

export enum TagSortBy {
  createdAt = 'createdAt',
  postCount = 'postCount',
  score = 'score',
}

registerEnumType(TagSortBy, {
  name: 'TagSortBy',
})

@ArgsType()
export class TagsArgs extends CursorPaginationArgs {
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
export class TagsByScoreArgs extends OffsetPaginationArgs {
  isForYou: boolean = false
}
