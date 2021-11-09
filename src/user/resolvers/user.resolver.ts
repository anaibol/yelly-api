import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PrismaService } from 'src/core/services/prisma.service'
import { NotificationService } from 'src/notification/services/notification.service'
import { GetUsersArgs } from '../dto/get-users.input'
import { ForgotPasswordInput } from '../dto/forgot-password.input'

import { User } from '../models/user.model'
import { UserService } from '../services/user.service'
import { UserCreateInput } from '../dto/create-user.input'

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
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
  async find(@Args() getUsersArgs: GetUsersArgs) {
    const result = await this.userService.find(0, getUsersArgs.limit)
    return result
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id') id: string) {
    const result = await this.userService.findOne(id)
    return result
  }

  @Mutation(() => User)
  async forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.requestResetPassword(forgotPasswordInput.email)
  }

  @Mutation(() => User)
  async signup(@Args('input') createUserData: UserCreateInput) {
    return this.userService.create(createUserData)
  }
}
