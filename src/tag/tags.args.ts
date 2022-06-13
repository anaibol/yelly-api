import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

export enum TagSortBy {
  createdAt = 'createdAt',
  postCount = 'postCount',
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
export class TagsArgs extends OffsetPaginationArgs {
  isEmoji: boolean = false
  showHidden: boolean = false
  @Field(() => TagSortBy)
  sortBy?: TagSortBy = TagSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}
