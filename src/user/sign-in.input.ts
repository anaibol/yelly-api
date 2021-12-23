import { InputType } from '@nestjs/graphql'

@InputType()
export class SignInInput {
  email: string
  password: string
}
