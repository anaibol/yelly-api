import { Req, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PostService } from 'src/post/services/post.service';
import { CreatePostInput } from '../dto/create-post.input';
import { GetPostsArgs } from '../dto/get-post.args';
import { Post } from '../models/post.model';
import { Tag } from '../models/tag.model';

@Resolver((of) => Tag)
export class PostResolver {
  constructor(private postsService: PostService) {}

  @Query((returns) => [Post], { name: 'posts' })
  async getPosts(@Args() GetPostsArgs?: GetPostsArgs) {
    const result = await this.postsService.find(
      GetPostsArgs.tag,
      GetPostsArgs.offset,
      GetPostsArgs.limit,
    );

    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Post)
  async createPost(@Args('input') createPostData: CreatePostInput) {
    return this.postsService.create(createPostData);
  }
}
