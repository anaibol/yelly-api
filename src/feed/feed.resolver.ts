import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FeedService } from './feed.service'
import { AuthGuard } from '../auth/auth-guard'
import { AuthUser } from '../auth/auth.service'
import { CurrentUser } from '../auth/user.decorator'
import { Feed } from './feed.model'
import { FeedArgs } from './feed.args'
import { MarkFeedItemsAsSeenArgs } from './mark-feed-items-as-seen.args'
import { MarkTrendAsSeenArgs } from './mark-trend-as-seen.args'
import { TrendsFeedArgs } from './trends-feed.args'
import { TrendsFeed } from './trends-feed.model'
import { PrismaService } from '../core/prisma.service'
import { TagService } from '../tag/tag.service'

@Resolver()
export class FeedResolver {
  constructor(private feedService: FeedService, private tagService: TagService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => Feed)
  async feed(@CurrentUser() authUser: AuthUser, @Args() feedArgs: FeedArgs): Promise<Feed> {
    const { after, limit, isSeen } = feedArgs

    return this.feedService.getFeed(authUser, limit, after, isSeen)
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  unreadFeedItemsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.feedService.getUnreadCount(authUser.id)
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

  @UseGuards(AuthGuard)
  @Query(() => TrendsFeed)
  async trendsFeed(@Args() trendsFeedArgs: TrendsFeedArgs, @CurrentUser() authUser: AuthUser): Promise<TrendsFeed> {
    const { skip, limit, postLimit } = trendsFeedArgs

    const { items, nextSkip } = await this.feedService.getTrendsFeed2({
      authUser,
      skip,
      limit,
      postLimit,
    })

    return { items, nextSkip }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  markTrendAsSeen(@CurrentUser() authUser: AuthUser, @Args() markTrendAsSeen: MarkTrendAsSeenArgs): Promise<boolean> {
    const { tagId, cursor } = markTrendAsSeen

    return this.feedService.markTrendAsSeen(authUser, tagId, cursor)
  }
}
