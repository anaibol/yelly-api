import { ArgsType } from '@nestjs/graphql'

import { OffsetPaginationArgs } from '../common/offset-pagination.args'

@ArgsType()
export class UserFollowersArgs extends OffsetPaginationArgs {
  userId: string
}
