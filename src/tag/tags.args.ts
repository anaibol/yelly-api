import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'

export enum SortBy {
  createdAt = 'createdAt',
  postCount = 'postCount',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortBy, {
  name: 'SortBy',
})

registerEnumType(SortDirection, {
  name: 'SortDirection',
})

@ArgsType()
export class TagsArgs extends OffsetPaginationArgs {
  isEmoji: boolean = false
  @Field(() => SortBy)
  sortBy?: SortBy = SortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}
