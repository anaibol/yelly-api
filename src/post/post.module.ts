import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'
import { TagService } from '../tag/tag.service'
import { NotificationService } from 'src/notification/notification.service'
import { PushNotificationService } from 'src/core/push-notification.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, TagService, PostResolver, NotificationService, PushNotificationService],
  exports: [PostService],
})
export class PostModule {}
