import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'

import { User } from './user.model'

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
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'
import { Loader } from '@tracworx/nestjs-dataloader'
import { CommonFriendsLoader } from './common-friends.loader'
import { CommonFriendsCountLoader } from './common-friends-count.loader'
import { IsFriendLoader } from './is-friend.loader'
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
  @Mutation(() => FriendRequest)
  createFriendRequest(
    @Args('otherUserId') otherUserId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<FriendRequest> {
    return this.userService.createFriendRequest(authUser, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  acceptFriendRequest(
    @Args('friendRequestId') friendRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.acceptFriendRequest(authUser, friendRequestId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteFriendRequest(
    @Args('friendRequestId') friendRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.deleteFriendRequest(authUser, friendRequestId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  unfriend(@Args('otherUserId') otherUserId: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.unfriend(authUser.id, otherUserId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  declineFriendRequest(
    @Args('friendRequestId') friendRequestId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<boolean> {
    return this.userService.declineFriendRequest(authUser, friendRequestId)
  }

  @ResolveField()
  friends(@Parent() user: User, @Args() offsetPaginationArgs: OffsetPaginationArgs): Promise<PaginatedUsers> {
    return this.userService.getFriends(user.id, offsetPaginationArgs.skip, offsetPaginationArgs.limit)
  }

  @ResolveField()
  friendsCount(@Parent() user: User): Promise<number> {
    return this.userService.getFriendsCount(user.id)
  }

  @ResolveField()
  async commonFriendsCountMultiUser(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser,
    @Loader(CommonFriendsCountLoader) commonFriendsCountLoader: DataLoader<string, number | undefined, string>
  ): Promise<number> {
    const commonFriendsCount = await commonFriendsCountLoader.load(user.id) // offsetPaginationArgs.skip, offsetPaginationArgs.limit

    if (!commonFriendsCount) return Promise.reject(new Error('Error'))
    // return this.userService.getCommonFriendsCount(authUser, user.id)

    return commonFriendsCount
  }

  @ResolveField()
  async commonFriendsCount(@Parent() user: User, @CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getCommonFriendsCount(authUser, user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async commonFriendsMultiUser(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser,
    @Args() offsetPaginationArgs: OffsetPaginationArgs,
    @Loader(CommonFriendsLoader) commonFriendsLoader: DataLoader<string, PaginatedUsers | undefined, string>
  ): Promise<PaginatedUsers> {
    const commonFriends = await commonFriendsLoader.load(user.id) // offsetPaginationArgs.skip, offsetPaginationArgs.limit

    if (!commonFriends) return Promise.reject(new Error('Error'))

    return commonFriends
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async commonFriends(
    @Parent() user: User,
    @CurrentUser() authUser: AuthUser,
    @Args() offsetPaginationArgs: OffsetPaginationArgs
  ): Promise<PaginatedUsers> {
    return this.userService.getCommonFriends(authUser, user.id, offsetPaginationArgs.skip, offsetPaginationArgs.limit)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isAuthUserFriend(
    @Parent() user: User,
    @Loader(IsFriendLoader) isFriendLoader: DataLoader<string, boolean | undefined, string>
  ): Promise<boolean> {
    const isFriend = await isFriendLoader.load(user.id)

    if (isFriend === undefined) return Promise.reject(new Error('isFriend undefined'))

    return isFriend
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
  async posts(@Parent() user: User, @Args() postsArgs: PostsArgs): Promise<PaginatedPosts> {
    const { after, limit } = postsArgs

    const posts = await this.prismaService.user
      .findUnique({
        where: { id: user.id },
      })
      .posts({
        where: {
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
