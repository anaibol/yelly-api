import { CacheModule, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'
import { TagService } from '../tag/tag.service'

@Module({
  imports: [CacheModule.register(), CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, TagService],
  exports: [PostService],
})
export class PostModule {}
