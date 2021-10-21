import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from 'src/post/services/post.service';
import { CreatePostInput } from '../input-types/tag.input-types';
import { Post } from '../models/post.model';
import { Tag } from '../models/tag.model';

@Resolver((of) => Tag)
export class PostResolver {
  constructor(private postsService: PostService) {}

  @Query((returns) => [Post], { name: 'posts' })
  getPostsByTag(@Args('tag') tag: string) {
    return this.postsService.findByTag(tag);
  }

  @Mutation((returns) => Post)
  async createPost(@Args('input') createPostData: CreatePostInput) {
    return this.postsService.create(createPostData);
  }
}
