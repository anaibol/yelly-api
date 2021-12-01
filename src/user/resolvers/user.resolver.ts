import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent, Context } from '@nestjs/graphql'
import { PaginationArgs } from '../../common/dto/pagination.args'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { Me } from '../models/me.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthService } from 'src/auth/auth.service'
import { PrismaService } from '../../core/services/prisma.service'

import { NotificationService } from 'src/notification/services/notification.service'
import { Token } from '../models/token.model'
import { SignInInput } from '../dto/sign-in.input'

import { UpdateUserInput } from '../dto/update-user.input'

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

    if (!user) {
      throw new UnauthorizedException()
    }

    return this.authService.login(user)
  }

  @Query(() => Me)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id)
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
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
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  updateMe(@Args('input') updateUserData: UpdateUserInput, @Context() context) {
    return this.userService.updateMe(updateUserData, context.req.username)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteAuthUser(@CurrentUser() user) {
    return this.userService.deleteByEmail(user.username)
  }

  @UseGuards(JwtAuthGuard)
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
