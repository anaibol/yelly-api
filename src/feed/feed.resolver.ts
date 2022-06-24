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
import { TrendArgs } from './trend.args'
import { PaginatedTrends, Trend } from './trend.model'
import { PrismaService } from '../core/prisma.service'
import { TagService } from '../tag/tag.service'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { Post } from '../post/post.model'

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
  @Mutation(() => Boolean)
  markTrendAsSeen(@CurrentUser() authUser: AuthUser, @Args() markTrendAsSeen: MarkTrendAsSeenArgs): Promise<boolean> {
    const { tagId, cursor } = markTrendAsSeen

    return this.feedService.markTrendAsSeen(authUser, tagId, cursor)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteUserFeedCursors(@CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.feedService.deleteUserFeedCursors(authUser)
  }
}

@Resolver(Trend)
export class TrendResolver {
  constructor(private feedService: FeedService, private tagService: TagService) {}

  @UseGuards(AuthGuard)
  @Query(() => Trend)
  async trend(@Args() trendsArgs: TrendArgs, @CurrentUser() authUser: AuthUser): Promise<Trend> {
    const { tagId, skip, limit } = trendsArgs

    return this.feedService.getTrend({
      tagId,
      authUser,
      skip,
      limit,
    })
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTrends)
  async trends(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTrends> {
    const { skip, limit } = offsetPaginationArgs

    const { items, nextSkip } = await this.feedService.getTrends({
      authUser,
      skip,
      limit,
    })

    return { items, nextSkip }
  }

  @ResolveField()
  firstPost(@Parent() trend: Trend): Promise<Post> {
    return this.tagService.getFirstPost(trend.id)
  }
}
