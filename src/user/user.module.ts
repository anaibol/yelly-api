import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { MeResolver } from './me.resolver.ts'
import { CoreModule } from '../core/core.module'
import { AuthModule } from '../auth/auth.module'
import { NotificationService } from '../notification/notification.service'
import { SchoolService } from './school.service'
import { UploadResolver } from './upload.resolver'

@Module({
  imports: [CoreModule, forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver, MeResolver, UploadResolver, SchoolService, NotificationService],
  exports: [UserService],
})
export class UserModule {}
