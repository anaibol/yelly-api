import { forwardRef, Module } from '@nestjs/common'
import { PostService } from 'src/post/post.service'
import { TagService } from 'src/tag/tag.service'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { NotificationService } from '../notification/notification.service'
import { SchoolService } from '../school/school.service'
import { MeResolver } from './me.resolver.ts'
import { UploadResolver } from './upload.resolver'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [CoreModule, forwardRef(() => AuthModule)],
  providers: [
    UserService,
    UserResolver,
    MeResolver,
    UploadResolver,
    SchoolService,
    NotificationService,
    PostService,
    TagService,
  ],
  exports: [UserService],
})
export class UserModule {}
