import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { PushNotificationController } from './push-notification.controller'
import { PushNotificationService } from './push-notification.service'

@Module({
  imports: [CoreModule],
  providers: [PushNotificationService],
  controllers: [PushNotificationController],
})
export class PushNotificationModule {}
