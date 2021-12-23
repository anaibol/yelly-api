import { InputType } from '@nestjs/graphql'

@InputType()
export class ResetPasswordInput {
  password: string
  resetToken: string
}
