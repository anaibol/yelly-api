import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent, Context } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination.args'
import { ForgotPasswordInput } from './forgot-password.input'
import { ToggleFollowInput } from './toggle-follow.input'
import { User } from './user.model'
import { Me } from './me.model'
import { UserService } from './user.service'
import { SignUpInput } from './sign-up.input'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { AuthService } from '../auth/auth.service'
import { PrismaService } from '../core/prisma.service'

import { NotificationService } from '../notification/notification.service'
import { Token } from './token.model'
import { SignInInput } from './sign-in.input'

import { UpdateUserInput } from './update-user.input'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  @Mutation(() => Token)
  async signIn(@Args('input') signInInput: SignInInput) {
    const user = await this.authService.validateUser(signInInput.email, signInInput.password)
    console.log({ user: 'asd' + user.id + 'asdd' })

    if (!user) {
      throw new UnauthorizedException()
    }

    const accessToken = this.authService.getAccessToken(user.id)

    return {
      accessToken,
    }
  }

  @Query(() => Me)
  @UseGuards(AuthGuard)
  async me(@Context() context) {
    const user = await this.userService.findOne(context.req.user.id)

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

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  refreshSendbirdAccessToken(@Context() context) {
    return this.userService.refreshSendbirdAccessToken(context.req.username)
  }

  @Mutation(() => User)
  forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.requestResetPassword(forgotPasswordInput.email)
  }

  @Mutation(() => Token)
  async signUp(@Args('input') signUpData: SignUpInput) {
    const user = await this.userService.signUp(signUpData)

    const accessToken = this.authService.getAccessToken(user.id)

    return {
      accessToken,
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  updateMe(@Args('input') updateUserData: UpdateUserInput, @Context() context) {
    return this.userService.updateMe(updateUserData, context.req.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteAuthUser(@CurrentUser() user) {
    return this.userService.deleteByEmail(user.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(@Args('input') toggleFollowInput: ToggleFollowInput, @CurrentUser() user) {
    return this.userService.toggleFollow(user.username, toggleFollowInput.otherUserId, toggleFollowInput.value)
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
