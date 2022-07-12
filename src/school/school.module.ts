import { Module } from '@nestjs/common'
import { NotificationService } from 'src/notification/notification.service'
import { TagService } from 'src/tag/tag.service'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { PostResolver } from '../post/post.resolver'
import { PostService } from '../post/post.service'
import { UserModule } from '../user/user.module'
import { SchoolResolver } from './school.resolver'
import { SchoolService } from './school.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, SchoolResolver, SchoolService, TagService, NotificationService],
  exports: [SchoolService],
})
export class SchoolModule {}
