import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { AuthGuard } from '../auth/auth-guard'
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

    return this.activityService.getActivities(userId, limit, after)
  }
}
