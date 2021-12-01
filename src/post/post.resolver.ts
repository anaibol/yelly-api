import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PostService } from '../post/post.service'
import { CreatePostInput } from './create-post.input'
import { DeletePostInput } from './delete-post.input'
import { GetPostsArgs } from './get-post.args'
import { PaginatedPosts } from './paginated-posts.model'
import { Post } from './post.model'

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') createPostData: CreatePostInput, @CurrentUser() currentUser) {
    return this.postService.create(createPostData, currentUser.username)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async trackPostViews(@Args({ name: 'postsIds', type: () => [String] }) postsIds: string[]) {
    return this.postService.trackPostViews(postsIds)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args('input') deletePostData: DeletePostInput, @CurrentUser() currentUser) {
    return this.postService.delete(deletePostData, currentUser.username)
  }
}
