import { ArgsType } from '@nestjs/graphql'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'

@ArgsType()
export class UserActivitiesArgs extends CursorPaginationArgs {
  userId: string
  isToday: boolean = false
}
