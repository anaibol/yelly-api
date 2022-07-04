import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PrismaService } from '../core/prisma.service'
import { TagService } from '../tag/tag.service'
import { FeedArgs } from './feed.args'
import { Feed } from './feed.model'
import { FeedService } from './feed.service'
import { MarkFeedItemsAsSeenArgs } from './mark-feed-items-as-seen.args'

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
}
