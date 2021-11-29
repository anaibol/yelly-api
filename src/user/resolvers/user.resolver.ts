import { Request, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { NotificationService } from 'src/notification/services/notification.service'
import { GetUsersArgs } from '../dto/get-users.input'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthService } from 'src/auth/auth.service'
import { Token } from '../models/token.model'
import { JwtService } from '@nestjs/jwt'
import { SignInInput } from '../dto/sign-in.input'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  @Mutation(() => Token)
  async signIn(@Args('input') signInInput: SignInInput) {
    const valid = await this.authService.validateUser(signInInput.email, signInInput.password)
    console.log(valid)

    return this.authService.login(signInInput)
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return this.userService.findOne(user.id)
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

  @Mutation(() => Token)
  async signUp(@Args('input') signUpData: SignUpInput) {
    const user = await this.userService.signUp(signUpData)
    const payload = { email: user.email, id: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
    }
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
