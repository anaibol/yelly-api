import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'

export enum TagSortBy {
  createdAt = 'createdAt',
  postCount = 'postCount',
  reactionsCount = 'reactionsCount',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(TagSortBy, {
  name: 'TagSortBy',
})

registerEnumType(SortDirection, {
  name: 'SortDirection',
})

@ArgsType()
export class TagsArgs extends CursorPaginationArgs {
  isYesterday: boolean = false
  showHidden: boolean = false
  @Field(() => TagSortBy)
  sortBy?: TagSortBy = TagSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
  authorId?: string
}
