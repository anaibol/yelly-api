import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginatedNotifications } from './paginated-notifications.model'
import { NotificationService } from './notification.service'
import { PaginationArgs } from '../common/pagination.args'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedNotifications)
  async notifications(@Args() PaginationArgs: PaginationArgs, @CurrentUser() authUser: AuthUser) {
    const { items, nextCursor } = await this.notificationService.find(
      authUser.id,
      PaginationArgs.after,
      PaginationArgs.limit
    )

    return { items, nextCursor }
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadNotificationsCount(@CurrentUser() authUser: AuthUser) {
    return this.notificationService.getUnreadCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markNotificationAsRead(@Args('notificationId') notificationId: string) {
    return this.notificationService.markAsRead(notificationId)
  }
}
