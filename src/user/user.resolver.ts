import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'

import { User } from './user.model'

import { PaginationArgs } from '../common/pagination.args'
import { PostsArgs } from '../post/posts.args'

import { ToggleFollowInput } from './toggle-follow.input'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'

import { UserService } from './user.service'
import { AuthUser } from '../auth/auth.service'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from 'src/post/post-select.constant'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'

@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
    private prismaService: PrismaService
  ) {}

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string): Promise<User> {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(
    @Args('input') toggleFollowInput: ToggleFollowInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.toggleFollow(authUser.id, toggleFollowInput.otherUserId, toggleFollowInput.value)
  }

  @ResolveField()
  async followers(@Parent() user: User, @Args() paginationArgs: PaginationArgs): Promise<PaginatedUsers> {
    return this.userService.getUserFollowers(user.id, paginationArgs.after, paginationArgs.limit)
  }

  @ResolveField()
  async followees(@Parent() user: User, @Args() paginationArgs: PaginationArgs): Promise<PaginatedUsers> {
    return this.userService.getUserFollowees(user.id, paginationArgs.after, paginationArgs.limit)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isFollowingAuthUser(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isFollowingAuthUser(user.id, authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isAuthUserFollowing(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isAuthUserFollowing(authUser.id, user.id)
  }

  @ResolveField('posts', () => PaginatedPosts)
  async posts(@Parent() user: User, @Args() postsArgs?: PostsArgs): Promise<PaginatedPosts> {
    const cacheKey = 'userPosts:' + JSON.stringify({ postsArgs, user })
    const previousResponse = await this.cacheManager.get<PaginatedPosts>(cacheKey)

    if (previousResponse) return previousResponse

    const { schoolId, after, limit } = postsArgs

    const posts = await this.prismaService.user.findUnique({ where: { id: user.id } }).posts({
      ...(schoolId && {
        where: {
          author: {
            schoolId,
          },
        },
      }),
      ...(after && {
        cursor: {
          createdAt: new Date(+after).toISOString(),
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelect,
    })

    const formattedPosts = posts.map((post) => ({
      ...post,
      totalReactionsCount: post._count.reactions,
      totalCommentsCount: post._count.comments,
    }))

    const nextCursor = posts.length === limit ? posts[limit - 1].createdAt.getTime().toString() : ''
    const response = { items: formattedPosts, nextCursor }
    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
