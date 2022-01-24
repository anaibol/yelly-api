import { InputType } from '@nestjs/graphql'

@InputType()
export class EmailSignInInput {
  email: string
  password: string
}
