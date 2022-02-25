import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

import { UserService } from '../user/user.service'

import { CreateLiveTagInput } from '../post/create-live-tag.input'
import { LiveTagAuthUser } from '../post/live-tag-auth-user.model'
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

@Resolver(Tag)
export class TagResolver {
  constructor(private tagService: TagService, private userService: UserService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => LiveTagAuthUser, { name: 'liveTag', nullable: true })
  async getLiveTag(@CurrentUser() authUser: AuthUser): Promise<LiveTagAuthUser | null> {
    return this.tagService.getAuthUserLiveTag(authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  createLiveTag(@Args('input') createLiveTag: CreateLiveTagInput, @CurrentUser() authUser: AuthUser): Promise<Tag> {
    if (!authUser.countryId) throw new Error('No auth user countryId')

    return this.tagService.createLiveTag(createLiveTag.text, authUser.id, authUser.countryId)
  }

  @Query(() => Tag)
  @UseGuards(AuthGuard)
  async tag(@Args() tagArgs: TagArgs) {
    return this.tagService.findById(tagArgs)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedTrends)
  async trends(
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedTrends> {
    if (!authUser.countryId) throw new Error('No auth user countryId')

    const { skip, limit } = offsetPaginationArgs
    const { items, nextSkip } = await this.tagService.getTrends(authUser.countryId, skip, limit)

    return { items, nextSkip }
  }

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @Args() postsArgs: PostsArgs,
    @CurrentUser() authUser: AuthUser
  ): Promise<PaginatedPosts> {
    const { limit, after } = postsArgs

    const user = await this.prismaService.user.findFirst({
      where: { id: authUser.id },
      select: {
        birthdate: true,
      },
    })

    const userAge = user && user.birthdate && dates.getAge(user.birthdate)
    const datesRanges = userAge && dates.getDateRanges(userAge)

    const items = await this.prismaService.tag.findUnique({ where: { id: tag.id } }).posts({
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
      select: PostSelect,
    })

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
