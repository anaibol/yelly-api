import { UseGuards } from '@nestjs/common'
import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
// import { MarkAsReadInput } from '../dto/mark-as-read.input'
import { PaginatedNotifications } from '../models/paginated-notifications.model'
import { NotificationService } from '../services/notification.service'
import { PaginationArgs } from '../../common/dto/pagination.args'

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedNotifications, { name: 'notifications' })
  async getNotifications(@Args() PaginationArgs: PaginationArgs, @Context() context) {
    const { notifications, cursor } = await this.notificationService.find(
      context.req.username,
      PaginationArgs.after,
      PaginationArgs.limit
    )

    return { items: notifications, nextCursor: cursor }
  }
}
