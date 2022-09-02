import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql'
import TwilioService from 'src/core/twilio.service'

import { AuthService, AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { OffsetPaginationArgs } from '../common/offset-pagination.args'
import { PaginatedUsers } from '../post/paginated-users.model'
import { AccessToken } from './accessToken.model'
import { CheckPhoneNumberVerificationCodeInput } from './CheckPhoneNumberVerificationCode.input'
import { EmailSignInInput } from './email-sign-in.input'
import { ExpoPushNotificationsTokenService } from './expoPushNotificationsToken.service'
import { ForgotPasswordInput } from './forgot-password.input'
import { InitPhoneNumberVerificationInput } from './init-phone-number-verification.input'
import { AgeVerificationResult, Me } from './me.model'
import { ResetPasswordInput } from './reset-password.input'
import { UpdateUserInput } from './update-user.input'
import { UserService } from './user.service'

// function validatePhoneNumberForE164(phoneNumber: string) {
//   const regEx = /^\+[1-9]\d{10,14}$/

//   return regEx.test(phoneNumber)
// }

@Resolver(Me)
export class MeResolver {
  constructor(
    private twilioService: TwilioService,
    private userService: UserService,
    private authService: AuthService,
    private expoPushNotificationsTokenService: ExpoPushNotificationsTokenService
  ) {}

  @Mutation(() => AccessToken)
  async emailSignIn(@Args('input') signInInput: EmailSignInInput): Promise<AccessToken> {
    const user = await this.authService.validateUser(signInInput.email, signInInput.password)

    if (!user) return Promise.reject(new Error('not found'))

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user.id),
      this.authService.getRefreshToken(user.id),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  @Mutation(() => Boolean)
  async initPhoneNumberVerification(
    @Args('input') initPhoneNumberVerificationInput: InitPhoneNumberVerificationInput
  ): Promise<boolean> {
    if (process.env.NODE_ENV === 'development' || initPhoneNumberVerificationInput.phoneNumber.startsWith('+263'))
      return true

    await this.twilioService.initPhoneNumberVerification(
      initPhoneNumberVerificationInput.phoneNumber,
      initPhoneNumberVerificationInput.locale
    )

    return true
  }

  @Mutation(() => AccessToken)
  async checkPhoneNumberVerificationCode(
    @Args('input') checkPhoneNumberVerificationCodeInput: CheckPhoneNumberVerificationCodeInput
  ): Promise<AccessToken> {
    const { phoneNumber, verificationCode, locale } = checkPhoneNumberVerificationCodeInput

    // if (!validatePhoneNumberForE164(phoneNumber)) return Promise.reject(new Error('Invalid phone number')

    await this.twilioService.checkPhoneNumberVerificationCode(phoneNumber, verificationCode)

    const { user, isNewUser } = await this.userService.findOrCreate(phoneNumber, locale)

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user.id),
      this.authService.getRefreshToken(user.id),
    ])

    return { accessToken, refreshToken, isNewUser }
  }

  @UseGuards(AuthGuard)
  @Query(() => Me)
  async me(@CurrentUser() authUser: AuthUser): Promise<Me> {
    const user = await this.userService.findMe(authUser.id)

    if (!user) return Promise.reject(new Error('not found'))

    return user
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Number)
  async tagViewsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getTagViewsCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Number)
  async tagReactionsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getTagReactionsCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async trendingTagsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getTrendingTagsCount(authUser.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async frontPageTagsCount(@CurrentUser() authUser: AuthUser): Promise<number> {
    return this.userService.getFrontPageTagsCount(authUser)
  }

  @Mutation(() => AccessToken)
  async refreshAccessToken(@Args('refreshToken') refreshToken: string): Promise<AccessToken> {
    return this.authService.refreshAccessToken(refreshToken)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  addExpoPushNotificationsToken(@Args('input') token: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.expoPushNotificationsTokenService.create(authUser.id, token)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteExpoPushNotificationsToken(@Args('input') token: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.expoPushNotificationsTokenService.deleteByUserAndToken(authUser.id, token)
  }

  @Mutation(() => Boolean)
  forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput): Promise<boolean> {
    return this.userService.requestResetPassword(forgotPasswordInput.email)
  }

  @Mutation(() => AccessToken)
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput): Promise<AccessToken> {
    const user = await this.userService.resetPassword(resetPasswordInput.password, resetPasswordInput.resetToken)

    if (!user) return Promise.reject(new Error('not found'))

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user.id),
      this.authService.getRefreshToken(user.id),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Me)
  updateMe(@Args('input') updateUserInput: UpdateUserInput, @CurrentUser() authUser: AuthUser): Promise<Me> {
    return this.userService.update(authUser.id, updateUserInput)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => AgeVerificationResult)
  updateAgeVerification(
    @Args('facePictureId') facePictureId: string,
    @CurrentUser() authUser: AuthUser
  ): Promise<AgeVerificationResult> {
    return this.userService.updateAgeVerification(authUser, facePictureId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteAuthUser(@CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.delete(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  authUserCanCreateTag(@CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.canCreateTag(authUser.id)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedUsers)
  followSuggestions(
    @CurrentUser() authUser: AuthUser,
    @Args() offsetPaginationArgs: OffsetPaginationArgs
  ): Promise<PaginatedUsers> {
    return this.userService.getFollowSuggestions(authUser, offsetPaginationArgs.skip, offsetPaginationArgs.limit)
  }
}
