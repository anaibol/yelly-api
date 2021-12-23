import { InputType } from '@nestjs/graphql'

@InputType()
export class SignUpInput {
  email: string
  password: string
  locale: string
}
