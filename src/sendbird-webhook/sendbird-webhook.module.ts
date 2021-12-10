import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { SendbirdWebhookController } from './sendbird-webhook.controller'
import { PushNotificationService } from '../core/push-notification.service'

@Module({
  imports: [CoreModule],
  providers: [PushNotificationService],
  controllers: [SendbirdWebhookController],
})
export class PushNotificationModule {}
