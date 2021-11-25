import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { CoreModule } from 'src/core/core.module'
import { UserModule } from 'src/user/user.module'
import { NotificationResolver } from './resolvers/notification.resolver'

import { NotificationService } from './services/notification.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
