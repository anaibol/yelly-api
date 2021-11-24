import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PrismaService } from 'src/core/services/prisma.service'
import { NotificationService } from 'src/notification/services/notification.service'
import { GetUsersArgs } from '../dto/get-users.input'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private prismaService: PrismaService
  ) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@Context() context) {
    const user = await this.userService.findByEmail(context.req.username)

    return {
      ...user,
      unreadNotificationsCount: await this.notificationService.countUnreadNotifications(
        this.prismaService.mapStringIdToBuffer(user.id)
      ),
    }
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(AuthGuard)
  find(@Args() getUsersArgs: GetUsersArgs) {
    return this.userService.find(0, getUsersArgs.limit)
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.requestResetPassword(forgotPasswordInput.email)
  }

  @Mutation(() => User)
  signUp(@Args('input') signUpData: SignUpInput) {
    return this.userService.signUp(signUpData)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteAuthUser(@Context() context) {
    return this.userService.deleteByEmail(context.req.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(@Args('input') toggleFollowInput: ToggleFollowInput, @Context() context) {
    return this.userService.toggleFollow(context.req.username, toggleFollowInput.otherUserId, toggleFollowInput.value)
  }

  @ResolveField()
  async followers(@Parent() user: User) {
    return this.userService.getUserFollowers(user.id)
  }

  @ResolveField()
  async followings(@Parent() user: User) {
    return this.userService.getUserFollowings(user.id)
  }
}
