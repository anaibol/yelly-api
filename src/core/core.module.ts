import { Module } from '@nestjs/common'
import { DataloaderModule } from '@tracworx/nestjs-dataloader'
import { ExpoPushNotificationsTokenService } from 'src/user/expoPushNotificationsToken.service'

import { AlgoliaService } from './algolia.service'
import { AmplitudeService } from './amplitude.service'
import { EmailService } from './email.service'
import { PrismaService } from './prisma.service'
import { PushNotificationService } from './push-notification.service'
import TwilioService from './twilio.service'

@Module({
  imports: [DataloaderModule],
  providers: [
    PrismaService,
    AlgoliaService,
    EmailService,
    TwilioService,
    ExpoPushNotificationsTokenService,
    PushNotificationService,
    AmplitudeService,
  ],
  exports: [
    PrismaService,
    AlgoliaService,
    EmailService,
    TwilioService,
    ExpoPushNotificationsTokenService,
    PushNotificationService,
    AmplitudeService,
  ],
})
export class CoreModule {}
