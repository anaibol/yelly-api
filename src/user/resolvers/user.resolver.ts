import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PrismaService } from 'src/core/services/prisma.service'
import { NotificationService } from 'src/notification/services/notification.service'
import { GetUsersArgs } from '../dto/get-users.input'
import { PaginationArgs } from '../../common/dto/pagination.args'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { Me } from '../models/me.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'
import { UpdateUserInput } from '../dto/update-user.input'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private prismaService: PrismaService
  ) {}

  @Query(() => Me)
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

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  updateMe(@Args('input') updateUserData: UpdateUserInput, @Context() context) {
    // TODO: once signin is done, add again the context param
    return this.userService.updateMe(updateUserData)
    // return this.userService.updateMe(updateUserData, context.req.username)
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
  async followers(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowers(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @ResolveField()
  async followees(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowees(user.id, PaginationArgs.after, PaginationArgs.limit)
  }
}
