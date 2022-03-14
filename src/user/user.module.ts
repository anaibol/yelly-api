import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { MeResolver } from './me.resolver.ts'
import { CoreModule } from '../core/core.module'
import { AuthModule } from '../auth/auth.module'
import { NotificationService } from '../notification/notification.service'
import { SchoolService } from '../school/school.service'
import { UploadResolver } from './upload.resolver'
import { PostService } from 'src/post/post.service'
import { TagService } from 'src/tag/tag.service'
import { SendbirdWebhookModule } from 'src/sendbird-webhook/sendbird-webhook.module'

@Module({
  imports: [CoreModule, forwardRef(() => AuthModule), SendbirdWebhookModule],
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
