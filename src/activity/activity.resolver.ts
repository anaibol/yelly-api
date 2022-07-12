import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { Activities } from './activity.model'
import { ActivityService } from './activity.service'
import { UserActivitiesArgs } from './user-activities.args'

@Resolver()
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @UseGuards(AuthGuard)
  @Query(() => Activities)
  async userActivities(@Args() userActivitiesArgs: UserActivitiesArgs): Promise<Activities> {
    const { userId, after, limit } = userActivitiesArgs

    return this.activityService.getUserActivities(userId, limit, after)
  }

  @UseGuards(AuthGuard)
  @Query(() => Activities)
  async activities(
    @CurrentUser() authUser: AuthUser,
    @Args() cursorPaginationArgs: CursorPaginationArgs
  ): Promise<Activities> {
    const { after, limit } = cursorPaginationArgs

    return this.activityService.getActivities(authUser, limit, after)
  }
}
