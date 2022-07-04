import { InputType } from '@nestjs/graphql'
import { IsLocale, IsPhoneNumber } from 'class-validator'

@InputType()
export class InitPhoneNumberVerificationInput {
  @IsPhoneNumber()
  phoneNumber: string
  @IsLocale()
  locale: string
}
