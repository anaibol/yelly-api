import { Module } from '@nestjs/common'
import { ExpoPushNotificationsTokenService } from 'src/user/expoPushNotificationsToken.service'
import { AlgoliaService } from './algolia.service'
import { EmailService } from './email.service'
import { PrismaService } from './prisma.service'
import { SendbirdService } from '../sendbird/sendbird.service'
import TwilioService from './twilio.service'
import { Neo4jService } from './neo4j.service'
import { PushNotificationService } from './push-notification.service'
import { AmplitudeService } from './amplitude.service'
import { SendbirdModule } from 'src/sendbird/sendbird.module'
import { DataloaderModule } from '@tracworx/nestjs-dataloader'

@Module({
  imports: [DataloaderModule, SendbirdModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    PrismaService,
    AlgoliaService,
    EmailService,
    SendbirdService,
    TwilioService,
    ExpoPushNotificationsTokenService,
    Neo4jService,
    PushNotificationService,
    AmplitudeService,
  ],
  exports: [
    PrismaService,
    AlgoliaService,
    EmailService,
    SendbirdService,
    TwilioService,
    ExpoPushNotificationsTokenService,
    Neo4jService,
    PushNotificationService,
    AmplitudeService,
  ],
})
export class CoreModule {}
