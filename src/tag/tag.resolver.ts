import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { PostSelectWithParent, mapPost } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { PaginatedTags } from './paginated-tags.model'
import { TagsArgs } from './tags.args'

import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'
import { PrismaService } from '../core/prisma.service'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { UpdateTagInput } from './update-tag.input'
import { Post } from '../post/post.model'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private prismaService: PrismaService) {}

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

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @CurrentUser() authUser: AuthUser,
    @Args() cursorPaginationArgs: CursorPaginationArgs
  ): Promise<PaginatedPosts> {
    const { limit, after } = cursorPaginationArgs

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const posts = await this.prismaService.post.findMany({
      where: {
        tags: {
          some: {
            id: tag.id,
          },
        },
      },
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

  @ResolveField()
  firstPost(@Parent() tag: Tag): Promise<Post> {
    return this.tagService.getFirstPost(tag.id)
  }
}
