import { CacheModule, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from '../post/post.resolver'
import { PostService } from '../post/post.service'
import { SchoolResolver } from './school.resolver'
import { SchoolService } from './school.service'
import { TagService } from 'src/tag/tag.service'
import { NotificationService } from 'src/notification/notification.service'

@Module({
  imports: [CacheModule.register(), CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, SchoolResolver, SchoolService, TagService, NotificationService],
  exports: [SchoolService],
})
export class SchoolModule {}
