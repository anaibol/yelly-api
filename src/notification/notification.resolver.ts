import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
// import { MarkAsReadInput } from '../mark-as-read.input'
import { PaginatedNotifications } from './paginated-notifications.model'
import { NotificationService } from './notification.service'
import { PaginationArgs } from '../common/pagination.args'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedNotifications, { name: 'notifications' })
  async getNotifications(@Args() PaginationArgs: PaginationArgs, @CurrentUser() authUser) {
    const { notifications, cursor } = await this.notificationService.find(
      authUser.id,
      PaginationArgs.after,
      PaginationArgs.limit
    )

    return { items: notifications, nextCursor: cursor }
  }
}
