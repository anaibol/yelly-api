import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { FeedResolver } from './feed.resolver'
import { FeedService } from './feed.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [FeedService, FeedResolver],
  exports: [FeedService],
})
export class FeedModule {}
