import { BadRequestException, Injectable } from '@nestjs/common'
import { Twilio } from 'twilio'
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification'
import { PrismaService } from './prisma.service'

@Injectable()
export default class TwilioService {
  private twilioClient: Twilio

  constructor(private prismaService: PrismaService) {
    this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  async initPhoneNumberVerification(phoneNumber: string, locale: string): Promise<VerificationInstance | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) return null

    return await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFICATION_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms', locale })
  }

  async checkPhoneNumberVerificationCode(phoneNumber: string, verificationCode: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') return true

    const result = await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFICATION_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode })

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided')
    }

    return true
  }
}
