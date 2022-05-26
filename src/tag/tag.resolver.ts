import { UseGuards } from '@nestjs/common'
import { Args, Field, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { CreateOrUpdateLiveTagInput } from '../post/create-or-update-live-tag.input'
import { BigIntCursorPaginationArgs } from 'src/common/big-int-cursor-pagination.args'

import { Tag } from './tag.model'
import { TagService } from './tag.service'
import { TagArgs } from './tag.args'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelectWithParent, mapPost } from '../post/post-select.constant'
import { PaginatedPosts } from '../post/paginated-posts.model'
import { PaginatedTags } from './paginated-tags.model'
import { UserService } from 'src/user/user.service'
import { TagsArgs } from './tags.args'
import { TrendsArgs } from './trends.args'
import { User } from 'src/user/user.model'

import { ObjectType } from '@nestjs/graphql'
import { Post } from 'src/post/post.model'

@ObjectType()
export class RankedTagPosts {
  @Field(() => BigInt)
  nextCursor: BigInt | null
  items: Post[]
}

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

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTags)
  async newTags(@Args() tagsArgs: TagsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedTags> {
    const { skip, limit, isEmoji } = tagsArgs

    const { items, nextSkip } = await this.tagService.getNewTags({
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
    @Args() bigIntCursorPaginationArgs: BigIntCursorPaginationArgs
  ): Promise<RankedTagPosts> {
    const { limit, after } = bigIntCursorPaginationArgs

    if (!authUser.birthdate) return Promise.reject(new Error('No birthdate'))

    const ranks = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).ranks({
      orderBy: { position: 'asc' },
      select: {
        id: true,
        post: {
          // where: {
          //   author: {
          //     isActive: true,
          //   },
          //   ...getNotExpiredCondition(),
          // },
          select: PostSelectWithParent,
        },
      },
      ...(after && {
        cursor: {
          id: after,
        },
        skip: 1,
      }),
      take: limit,
    })

    const items = ranks.map(({ post }) => post).map(mapPost)

    const lastItem = ranks.length === limit && ranks[limit - 1]

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor }
  }
}
