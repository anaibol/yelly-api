import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { CreateOrUpdateLiveTagInput } from '../post/create-or-update-live-tag.input'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { PostSelectWithParent, mapPost } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { PaginatedTags } from './paginated-tags.model'
// import { UserService } from 'src/user/user.service'
import { TagsArgs } from './tags.args'

import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'
import { PrismaService } from '../core/prisma.service'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { UpdateTagInput } from './update-tag.input'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService, private prismaService: PrismaService) {}

  @ResolveField()
  async author(@Parent() tag: Tag): Promise<User | null> {
    return this.tagService.getTagAuthor(tag.id)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  tag(@Args('text') tagText: string): Promise<Tag> {
    return this.tagService.getTag(tagText)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async tags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { skip, limit, isEmoji, sortBy, sortDirection, showHidden } = tagsArgs

    const { items, nextSkip } = await this.tagService.getTags(
      authUser,
      skip,
      limit,
      isEmoji,
      sortBy,
      sortDirection,
      showHidden
    )

    return { items, nextSkip }
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async trends(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTags> {
    const { skip, limit } = offsetPaginationArgs

    const { items, nextSkip } = await this.tagService.getTrends(authUser, skip, limit)

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
      orderBy: { createdAt: 'desc' },
      select: PostSelectWithParent,
      ...(after && {
        cursor: {
          id: after,
        },
        skip: 1,
      }),
      take: limit,
    })

    const items = posts.map(mapPost)

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : ''

    return { items, nextCursor }
  }

  @Mutation(() => Tag)
  @UseGuards(AuthGuard)
  updateTag(
    @CurrentUser() authUser: AuthUser,
    @Args('tagId') tagId: string,
    @Args('input') updateTagInput: UpdateTagInput
  ): Promise<Tag> {
    if (authUser.role !== 'ADMIN') return Promise.reject(new Error('No admin'))

    return this.tagService.updateTag(tagId, updateTagInput)
  }

  @Mutation(() => Tag)
  @UseGuards(AuthGuard)
  createPromotedTag(@CurrentUser() authUser: AuthUser, @Args('tagText') tagText: string): Promise<Tag> {
    if (authUser.role !== 'ADMIN') return Promise.reject(new Error('No admin'))

    return this.tagService.createPromotedTag(tagText, authUser)
  }
}
