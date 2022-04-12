import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { CreateOrUpdateLiveTagInput } from '../post/create-or-update-live-tag.input'
import { PostsArgs } from '../post/posts.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagArgs } from './tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import dates from '../utils/dates'
import { PaginatedTrends } from './paginated-trends.model'
import { UserService } from 'src/user/user.service'
import { TrendsArgs } from './trends'

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
    return this.tagService.createOrUpdateLiveTag(createOrUpdateLiveTag.text, createOrUpdateLiveTag.isLive, authUser)
  }

  @ResolveField()
  async authUserPosted(@Parent() tag: Tag, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.hasUserPostedOnTag(authUser.id, tag.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() tagArgs: TagArgs): Promise<Tag> {
    const tag = await this.tagService.findByText(tagArgs)

    if (!tag) return Promise.reject(new Error('No tag'))

    return tag
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTrends)
  async trends(@Args() trendsArgs: TrendsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTrends> {
    const { skip, limit, isEmoji } = trendsArgs

    const { items, nextSkip } = await this.tagService.getTrends(authUser, isEmoji, skip, limit)

    return { items, nextSkip }
  }

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @Args() postsArgs: PostsArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedPosts> {
    const { limit, after } = postsArgs

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const userAge = dates.getAge(authUser.birthdate)
    const datesRanges = dates.getDateRanges(userAge)

    const posts = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
      where: {
        author: {
          isActive: true,
          birthdate: datesRanges,
        },
        ...getNotExpiredCondition(),
      },
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelectWithParent,
    })

    const items = posts.map(mapPost)

    const lastItem = items.length === limit && items[limit - 1]

    const lastCreatedAt = lastItem && lastItem.createdAt

    const nextCursor = lastCreatedAt ? lastCreatedAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
