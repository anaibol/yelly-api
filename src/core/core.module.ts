import { Module } from '@nestjs/common'
import { ExpoPushNotificationsTokenService } from 'src/user/expoPushNotificationsToken.service'
import { AlgoliaService } from './algolia.service'
import { EmailService } from './email.service'
import { PrismaService } from './prisma.service'
import TwilioService from './twilio.service'
import { PushNotificationService } from './push-notification.service'
import { AmplitudeService } from './amplitude.service'
import { DataloaderModule } from '@tracworx/nestjs-dataloader'

@Module({
  imports: [DataloaderModule],
  providers: [
    PrismaService,
    AlgoliaService,
    EmailService,
    TwilioService,
    ExpoPushNotificationsTokenService,
    // Neo4jService,
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
