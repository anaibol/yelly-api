import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'

@ArgsType()
export class UserFolloweesArgs extends OffsetPaginationArgs {
  userId: string
  firstNameStartsWith?: string
  @Field(() => UserFolloweesSortBy)
  sortBy?: UserFolloweesSortBy = UserFolloweesSortBy.createdAt
  @Field(() => SortDirection)
  sortDirection?: SortDirection = SortDirection.desc
}

export enum UserFolloweesSortBy {
  createdAt = 'createdAt',
  firstName = 'firstName',
}

registerEnumType(UserFolloweesSortBy, {
  name: 'UserFolloweesSortBy',
})
