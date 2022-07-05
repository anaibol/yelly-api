import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PrismaService } from 'src/core/prisma.service'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { mapPost, PostSelectWithParent } from 'src/post/post-select.constant'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PaginatedTags } from '../tag/paginated-tags.model'
import { tagSelect } from '../tag/tag-select.constant'
import { User } from './user.model'
import { UserService } from './user.service'
import { UserFolloweesArgs } from './user-followees.args'
import { UserFollowersArgs } from './user-followers.args'
import { UserPostsArgs } from './user-posts.args'
import { UserTagsArgs } from './user-tags.args'
// import { Loader } from '@tracworx/nestjs-dataloader'
// import { CommonFriendsLoader } from './common-friends.loader'
// import { CommonFriendsCountLoader } from './common-friends-count.loader'
// import DataLoader from 'dataloader'

@Resolver(User)
export class UserResolver {
  constructor(private userService: UserService, private prismaService: PrismaService) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  user(@Args('id') id: string): Promise<User> {
    return this.userService.getUser(id)
  }

  @Query(() => PaginatedUsers)
  @UseGuards(AuthGuard)
  users(@Args('ids', { type: () => [String] }) ids: string[]): Promise<PaginatedUsers> {
    return this.userService.getUsers(ids)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  follow(@Args('otherUserId') otherUserId: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.follow(authUser.id, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  unFollow(@Args('otherUserId') otherUserId: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.unFollow(authUser.id, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteFollower(@Args('otherUserId') otherUserId: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.unFollow(otherUserId, authUser.id)
  }

  // @ResolveField()
  // async commonFriendsCountMultiUser(
  //   @Parent() user: User,
  //   @CurrentUser() authUser: AuthUser,
  //   @Loader(CommonFriendsCountLoader) commonFriendsCountLoader: DataLoader<string, number | undefined, string>
  // ): Promise<number> {
  //   const commonFriendsCount = await commonFriendsCountLoader.load(user.id) // offsetPaginationArgs.skip, offsetPaginationArgs.limit

  //   if (!commonFriendsCount) return Promise.reject(new Error('Error'))
  //   // return this.userService.getCommonFriendsCount(authUser, user.id)

  //   return commonFriendsCount
  // }

  // @ResolveField()
  // async commonFriendsCount(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<number> {
  //   return this.userService.getCommonFriendsCount(authUser, user.id)
  // }

  // @UseGuards(AuthGuard)
  // @ResolveField()
  // async commonFriendsMultiUser(
  //   @Parent() user: User,
  //   @CurrentUser() authUser: AuthUser,
  //   @Args() offsetPaginationArgs: OffsetPaginationArgs,
  //   @Loader(CommonFriendsLoader) commonFriendsLoader: DataLoader<string, PaginatedUsers | undefined, string>
  // ): Promise<PaginatedUsers> {
  //   const commonFriends = await commonFriendsLoader.load(user.id) // offsetPaginationArgs.skip, offsetPaginationArgs.limit

  //   if (!commonFriends) return Promise.reject(new Error('Error'))

  //   return commonFriends
  // }

  // @UseGuards(AuthGuard)
  // @ResolveField()
  // async commonFriends(
  //   @Parent() user: User,
  //   @CurrentUser() authUser: AuthUser,
  //   @Args() offsetPaginationArgs: OffsetPaginationArgs
  // ): Promise<PaginatedUsers> {
  //   return this.userService.getCommonFriends(authUser, user.id, offsetPaginationArgs.skip, offsetPaginationArgs.limit)
  // }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isFollowedByAuthUser(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isFollowedByUser(user.id, authUser.id)
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async isUserFollowedByAuthUser(@Args('userId') userId: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isFollowedByUser(userId, authUser.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  deleteUser(@CurrentUser() authUser: AuthUser, @Args('userId') userId: string): Promise<boolean> {
    if (authUser.role !== 'ADMIN') return Promise.reject(new Error('No admin'))

    return this.userService.delete(userId)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  banUser(@CurrentUser() authUser: AuthUser, @Args('userId') userId: string): Promise<boolean> {
    if (authUser.role !== 'ADMIN') return Promise.reject(new Error('No admin'))

    return this.userService.ban(userId)
  }

  @Query(() => PaginatedPosts)
  async userPosts(@Args() userPostsArgs: UserPostsArgs): Promise<PaginatedPosts> {
    const { userId, after, limit } = userPostsArgs

    const posts = await this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      ...(after && {
        cursor: {
          id: after,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: PostSelectWithParent,
    })

    const items = posts.map(mapPost)

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor }
  }

  @Query(() => PaginatedTags)
  async userTags(@Args() userTagsArgs: UserTagsArgs): Promise<PaginatedTags> {
    const { userId, after, limit } = userTagsArgs

    const [totalCount, items] = await Promise.all([
      this.prismaService.tag.count({
        where: {
          authorId: userId,
        },
      }),
      this.prismaService.tag.findMany({
        where: {
          authorId: userId,
        },
        ...(after && {
          cursor: {
            id: after,
          },
          skip: 1,
        }),
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        select: tagSelect,
      }),
    ])

    const lastItem = items.length === limit ? items[limit - 1] : null

    const nextCursor = lastItem ? lastItem.id : null

    return { items, nextCursor, totalCount }
  }

  @Query(() => PaginatedUsers)
  userFollowers(@Args() userFollowersArgs: UserFollowersArgs): Promise<PaginatedUsers> {
    const { userId, skip, limit } = userFollowersArgs
    return this.userService.getFollowers(userId, skip, limit)
  }

  @Query(() => PaginatedUsers)
  userFollowees(@Args() userFolloweesArgs: UserFolloweesArgs): Promise<PaginatedUsers> {
    const { userId, skip, limit } = userFolloweesArgs

    return this.userService.getFollowees(userId, skip, limit)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackUserView(@Args('userId') userId: string): Promise<boolean> {
    return this.userService.trackUserView(userId)
  }
}
