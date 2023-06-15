import { Module } from '@nestjs/common'
import { NotificationService } from 'src/notification/notification.service'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { TagService } from '../tag/tag.service'
import { UserModule } from '../user/user.module'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, TagService, PostResolver, NotificationService],
  exports: [PostService],
})
export class PostModule {}
