import { Module } from '@nestjs/common'
import { NotificationService } from 'src/notification/notification.service'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { PostResolver } from '../post/post.resolver'
import { PostService } from '../post/post.service'
import { SchoolService } from '../school/school.service'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'
import { TagResolver } from './tag.resolver'
import { TagService } from './tag.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, SchoolService, NotificationService, PostResolver, TagService, TagResolver, UserService],
  exports: [TagService],
})
export class TagModule {}
