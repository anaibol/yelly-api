import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { PostService } from 'src/post/services/post.service'
import { CreatePostInput } from '../dto/create-post.input'
import { GetPostsArgs } from '../dto/get-post.args'
import { PaginatedPosts } from '../models/paginated-posts.model'
import { Post } from '../models/post.model'

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPosts, { name: 'postsFeed' })
  async getPostsFeed(@Args() GetPostsArgs?: GetPostsArgs) {
    const { posts, cursor } = await this.postService.find(
      GetPostsArgs.tag,
      GetPostsArgs.userId,
      GetPostsArgs.after,
      GetPostsArgs.limit
    )

    return { items: posts, nextCursor: cursor }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') createPostData: CreatePostInput, @Context() context) {
    return this.postService.create(createPostData, context.req.username)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackPostViews(@Args({ name: 'postsIds', type: () => [String] }) postsIds: string[]) {
    return this.postService.trackPostViews(postsIds)
  }
}
