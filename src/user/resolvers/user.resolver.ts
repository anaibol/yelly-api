import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PrismaService } from 'src/core/services/prisma.service'
import { NotificationService } from 'src/notification/services/notification.service'
import { GetUsersArgs } from '../dto/get-users.input'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { ToggleFollowInput } from '../dto/toggle-follow.input'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'
import { SignUpInput } from '../dto/sign-up.input'
import { CityService } from 'src/user-training/services/city.service'
import { SchoolService } from 'src/user-training/services/school.service'
import { TrainingService } from 'src/user-training/services/training.service'
import { UserTrainingService } from 'src/user-training/services/user-training.service'

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private cityService: CityService,
    private schoolService: SchoolService,
    private trainingService: TrainingService,
    private userTrainingService: UserTrainingService,
    private prismaService: PrismaService
  ) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@Context() context) {
    const user = await this.userService.findByEmail(context.req.username)

    user.unreadNotificationsCount = await this.notificationService.countUnreadNotifications(
      this.prismaService.mapStringIdToBuffer(user.id)
    )

    return user
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(AuthGuard)
  async find(@Args() getUsersArgs: GetUsersArgs) {
    const result = await this.userService.find(0, getUsersArgs.limit)
    return result
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  async findOne(@Args('id') id: string) {
    const result = await this.userService.findOne(id)
    return result
  }

  @Query(() => User, { name: 'userFollowers' })
  @UseGuards(AuthGuard)
  async getUserFollowers(@Args('id') id: string, @Context() context) {
    const result = await this.userService.getUserFollowers(context.req.username, id)
    return result
  }

  @Query(() => User, { name: 'userFollowing' })
  @UseGuards(AuthGuard)
  async getUserFollowing(@Args('id') id: string, @Context() context) {
    const result = await this.userService.getUserFollowing(context.req.username, id)
    return result
  }

  @Mutation(() => User)
  async forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.requestResetPassword(forgotPasswordInput.email)
  }

  @Mutation(() => User)
  signUp(@Args('input') signUpData: SignUpInput) {
    return this.userService.signUp(signUpData)
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Boolean)
  async deleteAuthUser(@Context() context) {
    console.log(context.req.username)
    return await this.userService.deleteByEmail(context.req.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  toggleFollowUser(@Args('input') toggleFollowInput: ToggleFollowInput, @Context() context) {
    return this.userService.toggleFollow(context.req.username, toggleFollowInput.otherUserId, toggleFollowInput.value)
  }
}
