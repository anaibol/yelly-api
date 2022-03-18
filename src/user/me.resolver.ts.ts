import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { SendbirdAccessToken } from './sendbirdAccessToken'

import { Me } from './me.model'
import { AccessToken } from './accessToken.model'

import { CursorPaginationArgs } from '../common/cursor-pagination.args'
import { PostsArgs } from '../post/posts.args'

import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'

import { PrismaService } from '../core/prisma.service'
import { UserService } from './user.service'
import { AuthService, AuthUser } from '../auth/auth.service'
import { ExpoPushNotificationsTokenService } from './expoPushNotificationsToken.service'

import { ForgotPasswordInput } from './forgot-password.input'
import { EmailSignInInput } from './email-sign-in.input'
import { UpdateUserInput } from './update-user.input'
import { ResetPasswordInput } from './reset-password.input'
import { PostSelect } from 'src/post/post-select.constant'
import { PaginatedUsers } from 'src/post/paginated-users.model'
import TwilioService from 'src/core/twilio.service'
import { InitPhoneNumberVerificationInput } from './init-phone-number-verification.input'
import { CheckPhoneNumberVerificationCodeInput } from './CheckPhoneNumberVerificationCode.input'
import { NotFoundUserException } from './not-found-user.exception'
import { OffsetPaginationArgs } from 'src/common/offset-pagination.args'
import { PaginatedPosts } from 'src/post/paginated-posts.model'

function validatePhoneNumberForE164(phoneNumber: string) {
  const regEx = /^\+[1-9]\d{10,14}$/

  return regEx.test(phoneNumber)
}

@Resolver(() => Me)
export class MeResolver {
  constructor(
    private prismaService: PrismaService,
    private twilioService: TwilioService,
    private userService: UserService,
    private authService: AuthService,
    private expoPushNotificationsTokenService: ExpoPushNotificationsTokenService
  ) {}

  @Mutation(() => AccessToken)
  async emailSignIn(@Args('input') signInInput: EmailSignInInput): Promise<AccessToken> {
    const user = await this.authService.validateUser(signInInput.email, signInInput.password)

    if (!user) {
      throw new UnauthorizedException()
    }

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

    // if (!validatePhoneNumberForE164(phoneNumber)) throw new Error('Invalid phone number')

    await this.twilioService.checkPhoneNumberVerificationCode(phoneNumber, verificationCode)

    const user = await this.userService.findOrCreate(phoneNumber, locale)

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user.id),
      this.authService.getRefreshToken(user.id),
    ])

    return { accessToken, refreshToken }
  }

  @Query(() => Me)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() authUser: AuthUser): Promise<Me> {
    const user = await this.userService.findMe(authUser.id)

    if (!user) throw new UnauthorizedException()

    return user
  }

  @Mutation(() => AccessToken)
  async refreshAccessToken(
    @CurrentUser() authUser: AuthUser,
    @Args('refreshToken') refreshToken: string
  ): Promise<AccessToken> {
    return this.authService.refreshAccessToken(refreshToken)
  }

  @Mutation(() => SendbirdAccessToken)
  @UseGuards(AuthGuard)
  refreshSendbirdAccessToken(@CurrentUser() authUser: AuthUser): Promise<SendbirdAccessToken> {
    return this.userService.refreshSendbirdAccessToken(authUser.id)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  addExpoPushNotificationsToken(@Args('input') token: string, @CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.expoPushNotificationsTokenService.create(authUser.id, token)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
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

    if (!user) throw new NotFoundUserException()

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user.id),
      this.authService.getRefreshToken(user.id),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  @Mutation(() => Me)
  @UseGuards(AuthGuard)
  updateMe(@Args('input') updateUserData: UpdateUserInput, @CurrentUser() authUser: AuthUser): Promise<Me> {
    return this.userService.update(authUser.id, updateUserData)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  deleteAuthUser(@CurrentUser() authUser: AuthUser): Promise<boolean> {
    return this.userService.deleteById(authUser.id)
  }

  @ResolveField()
  friends(@Parent() user: Me, @Args() offsetPaginationArgs: OffsetPaginationArgs): Promise<PaginatedUsers> {
    return this.userService.getFriends(user.id, offsetPaginationArgs.skip, offsetPaginationArgs.limit)
  }

  @ResolveField()
  friendsCount(@Parent() user: Me): Promise<number> {
    return this.userService.getFriendsCount(user.id)
  }

  @ResolveField()
  async posts(
    @CurrentUser() authUser: AuthUser,
    @Parent() me: Me,
    @Args() postsArgs: PostsArgs
  ): Promise<PaginatedPosts> {
    const { after, limit } = postsArgs

    const posts = await this.prismaService.user.findUnique({ where: { id: me.id } }).posts({
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

    const items = posts.map(({ poll, ...post }) => ({
      ...post,
      ...(poll && {
        id: poll.id,
        options: poll.options.map((o) => ({
          id: o.id,
          text: o.text,
          votesCount: o._count.votes,
          // isAuthUserVote: !!o.votes.length,
        })),
      }),
    }))

    const nextCursor = items.length === limit ? items[limit - 1].createdAt.getTime().toString() : ''

    return { items, nextCursor }
  }
}
