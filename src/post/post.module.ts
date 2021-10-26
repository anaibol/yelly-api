import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';
import { TagService } from './services/tag.service';

@Module({
  imports: [CoreModule],
  providers: [PostService, PostResolver, TagService],
  exports: [PostService],
})
export class PostModule {}
