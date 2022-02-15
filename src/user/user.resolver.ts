import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'

import { User } from './user.model'

import { PaginationArgs } from '../common/pagination.args'
import { PostsArgs } from '../post/posts.args'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'

import { UserService } from './user.service'
import { AuthUser } from '../auth/auth.service'
import { PrismaService } from 'src/core/prisma.service'
import { PostSelect } from 'src/post/post-select.constant'
import { PaginatedPosts } from 'src/post/paginated-posts.model'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import { FriendRequest } from './friendRequest.model'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService, private prismaService: PrismaService) {}

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string): Promise<User> {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => FriendRequest)
  createFriendRequest(
    @Args('otherUserId') otherUserId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<FriendRequest> {
    return this.userService.createFriendRequest(authUser.id, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  acceptFriendRequest(
    @Args('friendRequestId') friendRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.acceptFriendRequest(authUser.id, friendRequestId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  declineFriendRequest(
    @Args('friendRequestId') friendRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.declineFriendRequest(authUser.id, friendRequestId)
  }

  @ResolveField()
  async friends(@Parent() user: User, @Args() paginationArgs: PaginationArgs): Promise<PaginatedUsers> {
    return this.userService.getFriends(user.id, paginationArgs.after, paginationArgs.limit)
  }

  @ResolveField()
  async friendsCount(@Parent() user: User): Promise<number> {
    return this.userService.getFriendsCount(user.id)
  }

  @ResolveField()
  commonFriendsCount(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getCommonFriendsCount(authUser.id, user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async commonFriends(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser,
    @Args() paginationArgs: PaginationArgs
  ): Promise<PaginatedUsers> {
    return this.userService.getCommonFriends(authUser.id, user.id, paginationArgs.after, paginationArgs.limit)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  isAuthUserFriend(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.isFriend(authUser.id, user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async authUserFriendRequestFromUser(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser
  ): Promise<FriendRequest | null> {
    return this.userService.getFriendRequest(user.id, authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async authUserFriendRequestToUser(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser
  ): Promise<FriendRequest | null> {
    return this.userService.getFriendRequest(authUser.id, user.id)
  }

  @ResolveField('posts', () => PaginatedPosts)
  async posts(@Parent() user: User, @Args() postsArgs: PostsArgs): Promise<PaginatedPosts> {
    const { schoolId, after, limit } = postsArgs

    const items = await this.prismaService.user.findUnique({ where: { id: user.id } }).posts({
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

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
