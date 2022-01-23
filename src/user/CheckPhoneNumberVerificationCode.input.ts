import { InputType } from '@nestjs/graphql'

@InputType()
export class CheckPhoneNumberVerificationCodeInput {
  phoneNumber: string
  verificationCode: string
  locale: string
}
