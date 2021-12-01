import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { CoreModule } from 'src/core/core.module'
import { AuthModule } from 'src/auth/auth.module'
import { NotificationService } from 'src/notification/services/notification.service'
import { SchoolService } from 'src/user-training/services/school.service'

@Module({
  imports: [CoreModule, forwardRef(() => AuthModule)],
  providers: [UserService, UserResolver, SchoolService, NotificationService],
  exports: [UserService],
})
export class UserModule {}
