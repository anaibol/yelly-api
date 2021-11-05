import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { ForgotPasswordInput } from '../dto/forgot-password.input'
import { User } from '../models/user.model'
import { UserService } from '../services/user.service'

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@Context() context) {
    return this.userService.findByEmail(context.req.username)
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
}
