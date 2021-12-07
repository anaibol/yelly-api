import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
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
import { SendbirdAccessToken } from './sendbirdAccessToken'
import { SignInInput } from './sign-in.input'

import { UpdateUserInput } from './update-user.input'
import { ResetPasswordInput } from './reset-password-.input'

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
    const userId = await this.authService.validateUser(signInInput.email, signInInput.password)

    if (!userId) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.authService.getAccessToken(this.prismaService.mapBufferIdToString(userId))

    return {
      accessToken,
    }
  }

  @Query(() => Me)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() authUser) {
    const user = await this.userService.findMe(authUser.id)

    if (!user) return new UnauthorizedException()

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

  @Mutation(() => SendbirdAccessToken)
  @UseGuards(AuthGuard)
  async refreshSendbirdAccessToken(@CurrentUser() authUser) {
    const sendbirdAccessToken = await this.userService.refreshSendbirdAccessToken(authUser.id)

    return { sendbirdAccessToken }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    await this.userService.requestResetPassword(forgotPasswordInput.email)
    return true
  }

  @Mutation(() => Token)
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    const user = await this.userService.resetPassword(resetPasswordInput.password, resetPasswordInput.resetToken)
    if (user) {
      const accessToken = this.authService.getAccessToken(user.id)
      return {
        accessToken,
      }
    }

    return {
      accessToken: '',
    }
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
  updateMe(@Args('input') updateUserData: UpdateUserInput, @CurrentUser() authUser) {
    return this.userService.updateMe(updateUserData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteAuthUser(@CurrentUser() authUser) {
    return this.userService.deleteById(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(@Args('input') toggleFollowInput: ToggleFollowInput, @CurrentUser() authUser) {
    return this.userService.toggleFollow(authUser.id, toggleFollowInput.otherUserId, toggleFollowInput.value)
  }

  @ResolveField()
  async followers(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowers(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @ResolveField()
  async followees(@Parent() user: User, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowees(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async isFollowingAuthUser(@Parent() user: User, @CurrentUser() authUser) {
    return this.userService.isFollowingAuthUser(user.id, authUser.id)
  }
}
