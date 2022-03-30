import { InputType } from '@nestjs/graphql'
import { IsPhoneNumber, IsLocale } from 'class-validator'

@InputType()
export class InitPhoneNumberVerificationInput {
  @IsPhoneNumber()
  phoneNumber: string
  @IsLocale()
  locale: string
}
