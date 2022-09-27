import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { SortDirection } from '../app.module'
import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PrismaService } from '../core/prisma.service'
import { PaginatedUsers } from '../post/paginated-users.model'
import { CreateTagInput } from './create-tag.input'
import { PaginatedTags, PaginatedTagsByScore } from './paginated-tags.model'
import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagMembersArgs, TagsArgs, TagsByScoreArgs, TagSortBy } from './tags.args'
import { UpdateTagInput } from './update-tag.input'

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => Tag)
  tag(@Args('tagId') tagId: bigint): Promise<Tag> {
    return this.tagService.getTag(tagId)
  }

  @Query(() => Tag)
  tagByNanoId(@Args('tagNanoId') nanoId: string): Promise<Tag> {
    return this.tagService.getTagByNanoId(nanoId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async createTag(@Args('input') createTagInput: CreateTagInput, @CurrentUser() authUser: AuthUser) {
    return this.tagService.create(createTagInput.tagText, authUser, createTagInput.type, createTagInput.isPublic)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async deleteTag(@Args('tagId') tagId: bigint, @CurrentUser() authUser: AuthUser) {
    const tag = await this.prismaService.tag.findUnique({ where: { id: tagId } })

    if (authUser.role !== 'ADMIN' && tag?.authorId !== authUser.id) return Promise.reject(new Error('No admin'))

    return this.tagService.delete(tagId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async joinTag(@Args('tagNanoId') nanoId: string, @CurrentUser() authUser: AuthUser) {
    return this.tagService.joinTag(nanoId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  async unJoinTag(@Args('tagNanoId') nanoId: string, @CurrentUser() authUser: AuthUser) {
    return this.tagService.unJoinTag(nanoId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackTagViews(@Args({ name: 'tagIds', type: () => [BigInt] }) tagIds: bigint[]) {
    return this.tagService.trackTagViews(tagIds)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackTagShare(@Args({ name: 'tagId', type: () => BigInt }) tagId: bigint) {
    return this.tagService.trackTagShare(tagId)
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

  @Query(() => PaginatedUsers)
  tagMembers(@Args() tagMembersArgs: TagMembersArgs): Promise<PaginatedUsers> {
    const { tagId, skip, limit, displayNameStartsWith } = tagMembersArgs

    return this.tagService.getMembers(tagId, skip, limit, displayNameStartsWith)
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
  @ResolveField()
  isReadOnly(@Parent() tag: Tag): boolean {
    if (!tag?.createdAt || !tag.expiresAt) return true

    return new Date(Date.now()).getTime() > tag.expiresAt.getTime()
  }
}
