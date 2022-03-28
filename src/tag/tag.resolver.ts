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

    const userAge = authUser?.birthdate && dates.getAge(authUser.birthdate)
    const datesRanges = userAge && dates.getDateRanges(userAge)

    const posts = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
      where: {
        author: {
          isActive: true,
        },
        OR: [
          {
            expiresAt: {
              gte: new Date(),
            },
          },
          {
            expiresAt: null,
          },
        ],
      },
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
      select: {
        ...PostSelect,
        pollOptions: {
          ...PostSelect.pollOptions,
          orderBy: {
            position: 'asc',
          },
        },
      },
    })

    const items = posts.map((post) => {
      const pollOptions = post.pollOptions.map((o) => ({
        id: o.id,
        text: o.text,
        votesCount: o._count.votes,
      }))

      return {
        ...post,
        ...(pollOptions.length && { pollOptions }),
      }
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
