import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CoreModule } from 'src/core/core.module';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './resolvers/post.resolver';
import { TagResolver } from './resolvers/tag.resolver';
import { PostService } from './services/post.service';
import { TagService } from './services/tag.service';

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [PostService, PostResolver, TagService, TagResolver],
  exports: [PostService],
})
export class PostModule {}
