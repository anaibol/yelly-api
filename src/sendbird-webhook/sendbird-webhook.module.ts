import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { SendbirdWebhookController } from './sendbird-webhook.controller'

@Module({
  imports: [CoreModule],
  controllers: [SendbirdWebhookController],
})
export class SendbirdWebhookModule {}
