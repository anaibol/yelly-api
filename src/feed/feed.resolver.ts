import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
import { Feed } from './feed.model'
import { FeedArgs } from './feed.args'
import { MarkFeedItemsAsSeenArgs } from './markFeedItemsAsSeen.args'

@Resolver()
export class FeedResolver {
  constructor(private feedService: FeedService) {}

  @UseGuards(AuthGuard)
  @Query(() => Feed)
  async feed(@CurrentUser() authUser: AuthUser, @Args() feedArgs: FeedArgs): Promise<Feed> {
    const { after, limit, isSeen } = feedArgs

    return this.feedService.getFeed(authUser, limit, after, isSeen)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markFeedItemsAsSeen(
    @CurrentUser() authUser: AuthUser,
    @Args() markFeedItemsAsSeen: MarkFeedItemsAsSeenArgs
  ): Promise<boolean> {
    const { after, before, feedItemId } = markFeedItemsAsSeen

    return this.feedService.markAsSeen(authUser, after, before, feedItemId)
  }
}
