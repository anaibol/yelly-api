import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginatedNotifications } from './paginated-notifications.model'
import { NotificationService } from './notification.service'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedNotifications)
  async notifications(
    @Args() cursorPaginationArgs: CursorPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedNotifications> {
    const { items, nextCursor } = await this.notificationService.find(
      authUser.id,
      cursorPaginationArgs.after,
      cursorPaginationArgs.limit
    )

    return { items, nextCursor }
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadNotificationsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.notificationService.getUnreadCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markNotificationAsRead(@Args('notificationId') notificationId: string): Promise<boolean> {
    return this.notificationService.markAsRead(notificationId)
  }
}
