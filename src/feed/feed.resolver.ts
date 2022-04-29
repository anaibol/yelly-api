import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
import { Feed } from './feed.model'
import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'

@Resolver()
export class FeedResolver {
  constructor(private feedService: FeedService) {}

  @UseGuards(AuthGuard)
  @Query(() => Feed)
  async feed(@Args() cursorPaginationArgs: CursorPaginationArgs, @CurrentUser() authUser: AuthUser): Promise<Feed> {
    const { after, limit } = cursorPaginationArgs

    return this.feedService.getFeed(authUser, limit, after)
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadFeedItemsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.feedService.getUnreadCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markFeedItemAsSeen(@Args('feedItemId') feedItemId: string): Promise<boolean> {
    return this.feedService.markAsSeen(feedItemId)
  }
}
