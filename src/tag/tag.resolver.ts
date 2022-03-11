import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { CreateOrUpdateLiveTagInput } from '../post/create-or-update-live-tag.input'
import { PostsArgs } from '../post/posts.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagArgs } from './tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import dates from '../utils/dates'
import { PaginatedTrends } from './paginated-trends.model'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { UserService } from 'src/user/user.service'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => [Tag])
  async liveTags(@CurrentUser() authUser: AuthUser): Promise<Tag[]> {
    return this.tagService.getLiveTags(authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  createOrUpdateLiveTag(
    @Args('input') createOrUpdateLiveTag: CreateOrUpdateLiveTagInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<Tag> {
    return this.tagService.createOrUpdateLiveTag(createOrUpdateLiveTag.text, createOrUpdateLiveTag.isLive, authUser.id)
  }

  @ResolveField()
  async authUserPosted(@Parent() tag: Tag, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.hasUserPostedOnTag(authUser.id, tag.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() tagArgs: TagArgs): Promise<Tag | null> {
    return this.tagService.findByText(tagArgs)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTrends)
  async trends(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTrends> {
    const { skip, limit } = offsetPaginationArgs
    const { items, nextSkip } = await this.tagService.getTrends(authUser, skip, limit)

    return { items, nextSkip }
  }

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @Args() postsArgs: PostsArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedPosts> {
    const { limit, after } = postsArgs

    const user = await this.prismaService.user.findFirst({
      where: { id: authUser.id },
      select: {
        birthdate: true,
      },
    })

    const userAge = user && user.birthdate && dates.getAge(user.birthdate)
    const datesRanges = userAge && dates.getDateRanges(userAge)

    const items = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1,
      }),
      ...(datesRanges && {
        where: {
          author: {
            is: {
              birthdate: datesRanges,
            },
          },
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelect,
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
