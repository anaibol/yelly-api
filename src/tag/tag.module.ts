import { CacheModule, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from '../post/post.resolver'
import { TagResolver } from './tag.resolver'
import { PostService } from '../post/post.service'
import { TagService } from './tag.service'

@Module({
  imports: [CacheModule.register(), CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, TagService, TagResolver],
  exports: [TagService],
})
export class TagModule {}