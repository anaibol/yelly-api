import { InputType } from '@nestjs/graphql'
import { MinLength } from 'class-validator'

@InputType()
export class ResetPasswordInput {
  @MinLength(6)
  password: string
  resetToken: string
}
