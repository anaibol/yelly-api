import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PrismaService } from '../core/prisma.service'
import { CreateOrUpdateTagReactionInput } from './create-or-update-tag-reaction.input'
import { CreateTagInput } from './create-tag.input'
import { DeleteTagReactionInput } from './delete-tag-reaction.input'
import { PaginatedTags, PaginatedTagsByScore } from './paginated-tags.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagReaction } from './tag-reaction.model'
import { TagsArgs, TagsByScoreArgs, TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => Tag)
  tag(@Args('tagId') tagId: bigint, @CurrentUser() authUser: AuthUser): Promise<Tag> {
    return this.tagService.getTag(tagId, authUser)
  }

  @UseGuards(AuthGuard)
  @Query(() => Tag)
  tagByNanoId(@Args('tagNanoId') nanoId: string, @CurrentUser() authUser: AuthUser): Promise<Tag> {
    console.log('tagByNanoId', { nanoId })
    return this.tagService.getTagByNanoId(nanoId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async createTag(@Args('input') createTagInput: CreateTagInput, @CurrentUser() authUser: AuthUser) {
    return this.tagService.create(createTagInput.tagText, authUser, createTagInput.type, createTagInput.isPublic)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async joinTag(@Args('tagNanoId') nanoId: string, @CurrentUser() authUser: AuthUser) {
    return this.tagService.joinTag(nanoId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackTagViews(@Args({ name: 'tagIds', type: () => [BigInt] }) tagIds: bigint[]) {
    return this.tagService.trackTagViews(tagIds)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async tags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { authorId, isForYou, after, limit, sortBy, sortDirection, showHidden, shouldIncludeExpired } = tagsArgs
    const showScoreFactor = authUser.isAdmin

    if (!authUser.countryId) return Promise.reject(new Error('No country'))

    const { items, nextCursor, totalCount } = await this.tagService.getTags(
      authUser,
      shouldIncludeExpired,
      isForYou,
      showScoreFactor,
      limit,
      after,
      sortBy,
      sortDirection,
      showHidden,
      authorId
    )

    if (authUser.isAdmin) {
      const scoredTags = items.map((tag) => ({
        ...tag,
        score: this.tagService.getTagScore(tag),
      }))
      return { items: scoredTags, nextCursor, totalCount }
    }

    return { items, nextCursor, totalCount }
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTagsByScore)
  async tagsByScore(
    @Args() tagsByScoreArgs: TagsByScoreArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTagsByScore> {
    if (!authUser.countryId) return Promise.reject(new Error('No country'))

    const { isForYou, skip, limit } = tagsByScoreArgs
    const showScoreFactor = authUser.isAdmin

    const { items, totalCount } = await this.tagService.getTags(
      authUser,
      false,
      isForYou,
      showScoreFactor,
      1000,
      undefined,
      TagSortBy.score,
      SortDirection.desc
    )

    const nextSkip = skip + limit

    const tags = items.map((tag) => ({
      ...tag,
      // Display score for admin only
      score: authUser.isAdmin ? tag.score : undefined,
      scoreFactor: authUser.isAdmin ? tag.scoreFactor : undefined,
    }))

    return { items: tags, nextSkip: totalCount > nextSkip ? nextSkip : null, totalCount }
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
    if (!tag?.createdAt || !tag.expiresAt) return true

    return new Date(Date.now()).getTime() > tag.expiresAt.getTime()
  }
}
