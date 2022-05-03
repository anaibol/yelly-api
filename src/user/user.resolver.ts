import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'

import { User } from './user.model'

import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'

import { UserService } from './user.service'
import { AuthUser } from '../auth/auth.service'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelectWithParent, mapPost, getNotExpiredCondition } from 'src/post/post-select.constant'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { FollowRequest } from './followRequest.model'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'
import { Loader } from '@tracworx/nestjs-dataloader'
// import { CommonFriendsLoader } from './common-friends.loader'
// import { CommonFriendsCountLoader } from './common-friends-count.loader'
import { IsFollowedByAuthUserLoader } from './is-followed-by-auth-user.loader'
import DataLoader from 'dataloader'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService, private prismaService: PrismaService) {}

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string): Promise<User> {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => FollowRequest)
  createFollowRequest(
    @Args('otherUserId') otherUserId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<FollowRequest> {
    return this.userService.createFollowRequest(authUser, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  acceptFollowRequest(
    @Args('followRequestId') followRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.acceptFollowRequest(authUser, followRequestId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteFollowRequest(
    @Args('followRequestId') followRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.deleteFollowRequest(authUser, followRequestId)
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
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  declineFollowRequest(
    @Args('followRequestId') followRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.declineFollowRequest(authUser, followRequestId)
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
  async isFollowedByAuthUser(
    @Parent() user: User,
    @Loader(IsFollowedByAuthUserLoader) isFollowedByAuthUserLoader: DataLoader<string, boolean | undefined, string>
  ): Promise<boolean> {
    const isFollowedByAuthUser = await isFollowedByAuthUserLoader.load(user.id)

    if (isFollowedByAuthUser === undefined) return Promise.reject(new Error('isFollowedByAuthUser undefined'))

    return isFollowedByAuthUser
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  pendingFollowRequestFromUser(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<FollowRequest | null> {
    return this.userService.getPendingFollowRequest(user.id, authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  pendingFollowRequestToUser(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<FollowRequest | null> {
    return this.userService.getPendingFollowRequest(authUser.id, user.id)
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

  @ResolveField('posts', () => PaginatedPosts)
  async posts(@Parent() user: User, @Args() cursorPaginationArgs: CursorPaginationArgs): Promise<PaginatedPosts> {
    const { after, limit } = cursorPaginationArgs

    const posts = await this.prismaService.user
      .findUnique({
        where: { id: user.id },
      })
      .posts({
        where: {
          ...getNotExpiredCondition(),
        },
        ...(after && {
          cursor: {
            createdAt: new Date(+after),
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

    const lastItem = items.length === limit && items[limit - 1]

    const lastCreatedAt = lastItem && lastItem.createdAt

    const nextCursor = lastCreatedAt ? lastCreatedAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
