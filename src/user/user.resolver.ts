import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination.args'
import { ToggleFollowInput } from './toggle-follow.input'
import { User } from './user.model'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthUser } from '../auth/auth.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(@Args('input') toggleFollowInput: ToggleFollowInput, @CurrentUser() authUser: AuthUser) {
    return this.userService.toggleFollow(authUser.id, toggleFollowInput.otherUserId, toggleFollowInput.value)
  }

  @ResolveField()
  async followers(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    console.log(333)
    return this.userService.getUserFollowers(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @ResolveField()
  async followees(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    console.log(333)
    return this.userService.getUserFollowees(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isFollowingAuthUser(@Parent() user: User, @CurrentUser() authUser: AuthUser) {
    return this.userService.isFollowingAuthUser(user.id, authUser.id)
  }
}
