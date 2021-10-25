import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostResolver } from './resolvers/post.resolver';
import { TagResolver } from './resolvers/tag.resolver';
import { PostService } from './services/post.service';

@Module({
  imports: [CoreModule],
  providers: [PostService, PostResolver, TagResolver],
  exports: [PostService],
})
export class PostModule {}
