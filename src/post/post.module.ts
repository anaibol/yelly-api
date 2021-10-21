import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostResolver } from './resolvers/post.resolver';
import { TagResolver } from './resolvers/tag.resolver';

@Module({
  providers: [PostService, PostResolver, TagResolver],
  exports: [PostService],
})
export class PostModule {}
