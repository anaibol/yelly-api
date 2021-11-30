import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
// import { MarkAsReadInput } from '../dto/mark-as-read.input'
import { PaginatedNotifications } from '../models/paginated-notifications.model'
import { NotificationService } from '../services/notification.service'
import { PaginationArgs } from '../../common/dto/pagination.args'
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard'

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
