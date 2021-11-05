import { Module } from '@nestjs/common'
import { PostModule } from 'src/post/post.module'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { CoreModule } from 'src/core/core.module'
import { AuthModule } from 'src/auth/auth.module'
import { NotificationService } from 'src/notification/services/notification.service'

@Module({
  imports: [PostModule, CoreModule, AuthModule],
  providers: [UserService, UserResolver, NotificationService],
  exports: [UserService],
})
export class UserModule {}
