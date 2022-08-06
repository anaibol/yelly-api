import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PaginatedUsers } from 'src/post/paginated-users.model'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { User } from './user.model'
import { UserService } from './user.service'
import { UserFolloweesArgs } from './user-followees.args'
import { UserFollowersArgs } from './user-followers.args'
// import { Loader } from '@tracworx/nestjs-dataloader'
// import { CommonFriendsLoader } from './common-friends.loader'
// import { CommonFriendsCountLoader } from './common-friends-count.loader'
// import DataLoader from 'dataloader'

@Resolver(User)
export class UserResolver {
  constructor(private userService: UserService) {}

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

  @UseGuards(AuthGuard)
  @ResolveField()
  async hasBlockedAuthUser(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isBlockedByUser(authUser.id, user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Number)
  async tagViewsCount(@Parent() user: User): Promise<number> {
    return this.userService.getTagViewsCount(user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Number)
  async tagReactionsCount(@Parent() user: User): Promise<number> {
    return this.userService.getTagReactionsCount(user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async trendingTagsCount(@Parent() user: User): Promise<number> {
    return this.userService.getTrendingTagsCount(user.id)
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

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  reportUser(@CurrentUser() authUser: AuthUser, @Args('otherUserId') otherUserId: string): Promise<boolean> {
    return this.userService.report(authUser, otherUserId)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  blockUser(@CurrentUser() authUser: AuthUser, @Args('otherUserId') otherUserId: string): Promise<boolean> {
    return this.userService.block(authUser, otherUserId)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  unBlockUser(@CurrentUser() authUser: AuthUser, @Args('otherUserId') otherUserId: string): Promise<boolean> {
    return this.userService.unBlock(authUser, otherUserId)
  }

  @Query(() => PaginatedUsers)
  userFollowers(@Args() userFollowersArgs: UserFollowersArgs): Promise<PaginatedUsers> {
    const { userId, skip, limit } = userFollowersArgs
    return this.userService.getFollowers(userId, skip, limit)
  }

  @Query(() => PaginatedUsers)
  userFollowees(@Args() userFolloweesArgs: UserFolloweesArgs): Promise<PaginatedUsers> {
    const { userId, skip, limit, firstNameStartsWith, sortBy, sortDirection } = userFolloweesArgs

    return this.userService.getFollowees(userId, skip, limit, firstNameStartsWith, sortBy, sortDirection)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackUserView(@Args('userId') userId: string): Promise<boolean> {
    return this.userService.trackUserView(userId)
  }
}
