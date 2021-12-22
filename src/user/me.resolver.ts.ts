import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { SendbirdAccessToken } from './sendbirdAccessToken'

import { Me } from './me.model'
import { Token } from './token.model'

import { PaginationArgs } from '../common/pagination.args'
import { GetPostsArgs } from '../post/get-posts.args'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'

import { UserService } from './user.service'
import { AuthService, AuthUser } from '../auth/auth.service'
import { NotificationService } from '../notification/notification.service'
import { ExpoPushNotificationsTokenService } from './expoPushNotificationsToken.service'
import { PostService } from 'src/post/post.service'

import { ForgotPasswordInput } from './forgot-password.input'
import { SignUpInput } from './sign-up.input'
import { SignInInput } from './sign-in.input'
import { UpdateUserInput } from './update-user.input'
import { ResetPasswordInput } from './reset-password.input'

@Resolver(() => Me)
export class MeResolver {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private expoPushNotificationsTokenService: ExpoPushNotificationsTokenService
  ) {}

  @Mutation(() => Token)
  async signIn(@Args('input') signInInput: SignInInput) {
    const user = await this.authService.validateUser(signInInput.email, signInInput.password)

    if (!user) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.authService.getAccessToken(user.id)

    return {
      accessToken,
    }
  }

  @Query(() => Me)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() authUser: AuthUser) {
    const user = await this.userService.findMe(authUser.id)

    if (!user) return new UnauthorizedException()

    return {
      ...user,
      unreadNotificationsCount: await this.notificationService.countUnreadNotifications(user.id),
    }
  }

  @Mutation(() => SendbirdAccessToken)
  @UseGuards(AuthGuard)
  async refreshSendbirdAccessToken(@CurrentUser() authUser: AuthUser) {
    const sendbirdAccessToken = await this.userService.refreshSendbirdAccessToken(authUser.id)

    return { sendbirdAccessToken }
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  addExpoPushNotificationsToken(@Args('input') token: string, @CurrentUser() authUser: AuthUser) {
    return this.expoPushNotificationsTokenService.create(authUser.id, token)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  deleteExpoPushNotificationsToken(@Args('input') token: string, @CurrentUser() authUser: AuthUser) {
    return this.expoPushNotificationsTokenService.deleteByUserAndToken(authUser.id, token)
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    await this.userService.requestResetPassword(forgotPasswordInput.email)
    return true
  }

  @Mutation(() => Token)
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    const user = await this.userService.resetPassword(resetPasswordInput.password, resetPasswordInput.resetToken)

    const accessToken = this.authService.getAccessToken(user.id)
    return {
      accessToken,
    }
  }

  @Mutation(() => Token)
  async signUp(@Args('input') signUpData: SignUpInput) {
    if (
      process.env.ADMIN_MODE === 'true' &&
      process.env.NODE_ENV === 'production' &&
      !signUpData.email.endsWith('@yelly.app')
    ) {
      throw new UnauthorizedException()
    }

    const user = await this.userService.signUp(signUpData)

    const accessToken = this.authService.getAccessToken(user.id)

    return {
      accessToken,
    }
  }

  @Mutation(() => Me)
  @UseGuards(AuthGuard)
  updateMe(@Args('input') updateUserData: UpdateUserInput, @CurrentUser() authUser: AuthUser) {
    return this.userService.updateMe(updateUserData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteAuthUser(@CurrentUser() authUser: AuthUser) {
    return this.userService.deleteById(authUser.id)
  }

  @ResolveField()
  async followers(@Parent() user: Me, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowers(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @ResolveField()
  async followees(@Parent() user: Me, @Args() PaginationArgs: PaginationArgs) {
    return this.userService.getUserFollowees(user.id, PaginationArgs.after, PaginationArgs.limit)
  }

  @ResolveField()
  async posts(@Parent() me: Me, @Args() GetPostsArgs?: GetPostsArgs) {
    const cacheKey = 'mePosts:' + JSON.stringify(GetPostsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse
    console.log('me.id:', me.id)
    const { schoolId, after, limit } = GetPostsArgs
    const { posts, cursor } = await this.postService.find(null, me.id, schoolId, after, limit)
    const response = { items: posts, nextCursor: cursor }
    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }
}
