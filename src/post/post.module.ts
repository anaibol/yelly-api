import { CacheModule, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'
import { TagService } from '../tag/tag.service'
import { NotificationService } from 'src/notification/notification.service'
import { PushNotificationService } from 'src/core/push-notification.service'
import { PushNotificationModule } from 'src/sendbird-webhook/sendbird-webhook.module'

@Module({
  imports: [CacheModule.register(), CoreModule, AuthModule, UserModule, PushNotificationModule],
  providers: [PostService, TagService, NotificationService, PostResolver, PushNotificationService],
  exports: [PostService],
})
export class PostModule {}
