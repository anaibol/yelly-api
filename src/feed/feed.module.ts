import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { TagModule } from '../tag/tag.module'
import { UserModule } from '../user/user.module'
import { FeedResolver, TrendResolver } from './feed.resolver'
import { FeedService } from './feed.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule, TagModule],
  providers: [FeedService, FeedResolver, TrendResolver],
  exports: [FeedService],
})
export class FeedModule {}
