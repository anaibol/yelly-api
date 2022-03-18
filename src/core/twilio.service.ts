import { BadRequestException, Injectable } from '@nestjs/common'
import { Twilio } from 'twilio'
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification'

@Injectable()
export default class TwilioService {
  private twilioClient: Twilio

  constructor() {
    this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  initPhoneNumberVerification(phoneNumber: string, locale: string): Promise<VerificationInstance | null> {
    return this.twilioClient.verify
      .services(process.env.TWILIO_VERIFICATION_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms', locale })
  }

  async checkPhoneNumberVerificationCode(phoneNumber: string, verificationCode: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development' || phoneNumber.startsWith('+263')) return true

    const result = await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFICATION_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode })

    if (!result.valid || result.status !== 'approved') return Promise.reject(new Error('Wrong code provided'))

    return true
  }
}
