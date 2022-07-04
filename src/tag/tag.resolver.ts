import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { PrismaService } from '../core/prisma.service'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { mapPost, PostSelectWithParent } from '../post/post-select.constant'
import { CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { CreateTagInput } from './create-tag.input'
import { DeleteTagReactionInput } from './delete-tag-reaction.input'
import { PaginatedTags } from './paginated-tags.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagReaction } from './tag-reaction.model'
import { TagsArgs } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private prismaService: PrismaService) {}

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  tag(@Args('tagId') tagId: bigint): Promise<Tag> {
    return this.tagService.getTag(tagId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async createTag(@Args('input') createTagInput: CreateTagInput, @CurrentUser() authUser: AuthUser) {
    return this.tagService.create(createTagInput.tagText, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackTagViews(@Args({ name: 'tagIds', type: () => [BigInt] }) tagIds: bigint[]) {
    return this.tagService.trackTagViews(tagIds)
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  tagExists(@Args('tagText') tagText: string): Promise<boolean> {
    return this.tagService.getTagExists(tagText)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async tags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { date, skip, limit, sortBy, sortDirection, showHidden } = tagsArgs

    if (!authUser.countryId) return Promise.reject(new Error('No country'))

    const { items, nextSkip } = await this.tagService.getTags(
      authUser.countryId,
      date,
      skip,
      limit,
      sortBy,
      sortDirection,
      showHidden,
      authUser
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

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor }
  }

  @Mutation(() => Tag)
  @UseGuards(AuthGuard)
  updateTag(
    @CurrentUser() authUser: AuthUser,
    @Args('tagId') tagId: bigint,
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

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteTagReaction(
    @Args('input') deleteTagReactionInput: DeleteTagReactionInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.tagService.deleteTagReaction(deleteTagReactionInput.tagId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => TagReaction)
  async createOrUpdateTagReaction(
    @Args('input') createTagReactionInput: CreateOrUpdateTagReactionInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<TagReaction> {
    return this.tagService.createOrUpdateTagReaction(createTagReactionInput, authUser)
  }

  @ResolveField()
  async authUserReaction(@Parent() tag: Tag, @CurrentUser() authUser: AuthUser): Promise<TagReaction | null> {
    return this.tagService.getAuthUserReaction(tag.id, authUser)
  }
}
