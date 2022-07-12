import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { NotificationService } from './notification.service'
import { PaginatedNotifications } from './paginated-notifications.model'
@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedNotifications)
  async notifications(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedNotifications> {
    const { items, nextSkip } = await this.notificationService.find(
      authUser.id,
      offsetPaginationArgs.skip,
      offsetPaginationArgs.limit
    )

    return { items, nextSkip }
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadNotificationsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.notificationService.getUnreadCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markNotificationAsSeen(@Args('notificationId') notificationId: string): Promise<boolean> {
    return this.notificationService.markAsSeen(notificationId)
  }
}
