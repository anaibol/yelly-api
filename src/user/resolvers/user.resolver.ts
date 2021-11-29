import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { PaginationArgs } from '../../common/dto/pagination.args'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthService } from 'src/auth/auth.service'
import { Token } from '../models/token.model'
import { SignInInput } from '../dto/sign-in.input'

type Follower = {
  id: string
  firstName: string
  pictureId: string
  userTraining: {
    school: {
      name: string
    }
  }
}

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Mutation(() => Token)
  async signIn(@Args('input') signInInput: SignInInput) {
    const user = await this.authService.validateUser(signInInput.email, signInInput.password)

    if (!user) {
      throw new UnauthorizedException()
    }

    return this.authService.login(user)
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user) {
    return this.userService.findByEmail(user.username)
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
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
    return this.authService.login(user)
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
