import { Module } from '@nestjs/common'
import { PostModule } from 'src/post/post.module'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { CoreModule } from 'src/core/core.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [PostModule, CoreModule, AuthModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
