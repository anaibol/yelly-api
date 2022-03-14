import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginatedNotifications } from './paginated-notifications.model'
import { NotificationService } from './notification.service'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
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
