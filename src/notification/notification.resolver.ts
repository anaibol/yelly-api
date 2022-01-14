import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
// import { MarkAsReadInput } from '../mark-as-read.input'
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
  @Query(() => PaginatedNotifications, { name: 'notifications' })
  async getNotifications(@Args() PaginationArgs: PaginationArgs, @CurrentUser() authUser: AuthUser) {
    const { notifications, cursor } = await this.notificationService.find(
      authUser.id,
      PaginationArgs.after,
      PaginationArgs.limit
    )

    return { items: notifications, nextCursor: cursor }
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadNotificationsCount(@CurrentUser() authUser: AuthUser) {
    return this.notificationService.getUnreadNotificationsCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  updateIsSeenNotification(@Args('input') notificationId: string) {
    return this.notificationService.updateIsSeenNotification(notificationId)
  }
}
