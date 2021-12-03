import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { UserModule } from '../user/user.module'
import { PostResolver } from './post.resolver'
import { TagResolver } from './tag.resolver'
import { PostService } from './post.service'
import { TagService } from './tag.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, TagService, TagResolver],
  exports: [PostService],
})
export class PostModule {}
