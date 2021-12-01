import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
// import { MarkAsReadInput } from '../mark-as-read.input'
import { PaginatedNotifications } from './paginated-notifications.model'
import { NotificationService } from './notification.service'
import { PaginationArgs } from '../common/pagination.args'
import { CurrentUser, JwtAuthGuard } from '../auth/jwt-auth.guard'

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedNotifications, { name: 'notifications' })
  async getNotifications(@Args() PaginationArgs: PaginationArgs, @CurrentUser() currentUser) {
    const { notifications, cursor } = await this.notificationService.find(
      currentUser.username,
      PaginationArgs.after,
      PaginationArgs.limit
    )

    return { items: notifications, nextCursor: cursor }
  }
}
