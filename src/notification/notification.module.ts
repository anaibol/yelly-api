import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { NotificationResolver } from './notification.resolver'
import { NotificationService } from './notification.service'
import { ControllerController } from './controller/controller.controller'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
  controllers: [ControllerController],
})
export class NotificationModule {}
