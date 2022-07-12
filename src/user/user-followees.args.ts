import { ArgsType } from '@nestjs/graphql'

import { OffsetPaginationArgs } from '../common/offset-pagination.args'

@ArgsType()
export class UserFolloweesArgs extends OffsetPaginationArgs {
  userId: string
}
