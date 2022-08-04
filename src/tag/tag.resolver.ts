import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { orderBy } from 'lodash'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { PrismaService } from '../core/prisma.service'
import { getLastResetDate, getNextResetDate, getPreviousResetDate } from '../utils/dates'
import { CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { CreateTagInput } from './create-tag.input'
import { DeleteTagReactionInput } from './delete-tag-reaction.input'
import { PaginatedTags, PaginatedTagsByScore } from './paginated-tags.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagReaction } from './tag-reaction.model'
import { TagsArgs, TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => Tag)
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

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  tagExists(@Args('tagText') tagText: string): Promise<boolean> {
    return this.tagService.getTagExists(tagText)
  }

  @UseGuards(AuthGuard)
  @Query(() => Date)
  getLastResetDate(): Date {
    return getLastResetDate()
  }

  @UseGuards(AuthGuard)
  @Query(() => Date)
  getPreviousResetDate(): Date {
    return getPreviousResetDate()
  }

  @UseGuards(AuthGuard)
  @Query(() => Date)
  getNextResetDate(): Date {
    return getNextResetDate()
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async tags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { authorId, isYesterday, after, limit, sortBy, sortDirection, showHidden } = tagsArgs

    if (!authUser.countryId) return Promise.reject(new Error('No country'))

    const { items, nextCursor, totalCount } = await this.tagService.getTags(
      authUser,
      isYesterday,
      limit,
      after,
      sortBy,
      sortDirection,
      showHidden,
      authorId
    )

    return { items, nextCursor, totalCount }
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTagsByScore)
  async tagsByScore(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTagsByScore> {
    if (!authUser.countryId) return Promise.reject(new Error('No country'))

    const { skip, limit } = offsetPaginationArgs

    const { items, totalCount } = await this.tagService.getTags(
      authUser,
      false,
      1000,
      undefined,
      TagSortBy.postCount,
      SortDirection.desc
    )

    const scoredTags = orderBy(
      items.map((tag) => ({
        ...tag,
        score: tag.viewsCount ? (tag.postCount + tag.reactionsCount) / tag.viewsCount : 0,
      })),
      'score',
      'desc'
    ).slice(skip, skip + limit)

    const nextSkip = skip + limit

    return { items: scoredTags, nextSkip: totalCount > nextSkip ? nextSkip : 0, totalCount, nextCursor: null }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  updateTag(
    @CurrentUser() authUser: AuthUser,
    @Args('tagId') tagId: bigint,
    @Args('input') updateTagInput: UpdateTagInput
  ): Promise<Tag> {
    if (authUser.role !== 'ADMIN') return Promise.reject(new Error('No admin'))

    return this.tagService.updateTag(tagId, updateTagInput)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
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

  @UseGuards(AuthGuard)
  @ResolveField()
  async authUserReaction(@Parent() tag: Tag, @CurrentUser() authUser: AuthUser): Promise<TagReaction | null> {
    return this.tagService.getAuthUserReaction(tag.id, authUser)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  isReadOnly(@Parent() tag: Tag): boolean {
    return !!(tag?.createdAt && tag.createdAt < getLastResetDate())
  }
}
