import { InputType } from '@nestjs/graphql'

@InputType()
export class InitPhoneNumberVerificationInput {
  phoneNumber: string
  locale: string
}
