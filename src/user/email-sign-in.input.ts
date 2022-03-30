import { InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@InputType()
export class EmailSignInInput {
  @IsEmail()
  email: string
  password: string
}
