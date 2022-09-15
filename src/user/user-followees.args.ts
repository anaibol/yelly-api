import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'

@ArgsType()
export class UserFolloweesArgs extends OffsetPaginationArgs {
  userId: string
  displayNameStartsWith?: string
  @Field(() => UserFolloweesSortBy)
  sortBy?: UserFolloweesSortBy = UserFolloweesSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}

export enum UserFolloweesSortBy {
  createdAt = 'createdAt',
  displayName = 'displayName',
}

registerEnumType(UserFolloweesSortBy, {
  name: 'UserFolloweesSortBy',
})
