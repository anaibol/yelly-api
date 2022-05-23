import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { CreateOrUpdateLiveTagInput } from '../post/create-or-update-live-tag.input'
import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagArgs } from './tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { PaginatedTags } from './paginated-tags.model'
import { UserService } from 'src/user/user.service'
import { TagsArgs } from './tags.args'
import { TrendsArgs } from './trends.args'
import { User } from 'src/user/user.model'

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

  @ResolveField()
  async author(@Parent() tag: Tag): Promise<User | null> {
    return this.tagService.getTagAuthor(tag.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() tagArgs: TagArgs): Promise<Tag> {
    const tag = await this.tagService.findByText(tagArgs)

    if (!tag) return Promise.reject(new Error('No tag'))

    return tag
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async tags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { skip, limit, isEmoji } = tagsArgs

    const { items, nextSkip } = await this.tagService.getTags(authUser, skip, limit, isEmoji)

    return { items, nextSkip }
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async trends(@Args() trendsArgs: TrendsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { startDate, endDate, skip, limit, isEmoji } = trendsArgs

    const { items, nextSkip } = await this.tagService.getTrends({
      startDate,
      endDate,
      authUser,
      skip,
      limit,
      isEmoji,
    })

    return { items, nextSkip }
  }

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @CurrentUser() authUser: AuthUser,
    @Args() cursorPaginationArgs: CursorPaginationArgs
  ): Promise<PaginatedPosts> {
    const { limit, after } = cursorPaginationArgs

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const posts = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
      where: {
        author: {
          isActive: true,
        },
        ...getNotExpiredCondition(),
      },
      ...(after && {
        cursor: {
          createdAt: new Date(+after),
        },
        skip: 1,
      }),
      orderBy: [
        {
          reactions: {
            _count: 'desc',
          },
        },
        { createdAt: 'desc' },
      ],
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
