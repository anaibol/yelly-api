import { UseGuards, Inject, CACHE_MANAGER } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PostService } from '../post/post.service'
import { AuthUser } from '../auth/auth.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { GetPostsArgs } from './get-post.args'
import { PaginatedPosts } from './paginated-posts.model'
import { Cache } from 'cache-manager'
import { Post } from './post.model'
@Resolver()
export class PostResolver {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPosts, { name: 'postsFeed' })
  async getPostsFeed(@Args() GetPostsArgs?: GetPostsArgs) {
    const cacheKey = 'postsFeed:' + JSON.stringify(GetPostsArgs)
    const previousResponse = await this.cacheManager.get(cacheKey)

    if (previousResponse) return previousResponse

    const { posts, cursor } = await this.postService.find(
      GetPostsArgs.tag,
      GetPostsArgs.userId,
      GetPostsArgs.after,
      GetPostsArgs.limit
    )

    const response = { items: posts, nextCursor: cursor }

    this.cacheManager.set(cacheKey, response, { ttl: 5 })

    return response
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') createPostData: CreatePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.create(createPostData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackPostViews(@Args({ name: 'postsIds', type: () => [String] }) postsIds: string[]) {
    return this.postService.trackPostViews(postsIds)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async deletePost(@Args('input') deletePostData: DeletePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.delete(deletePostData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deletePostReaction(
    @Args('input') deletePostReactionData: DeletePostReactionInput,
    @CurrentUser() authUser: AuthUser
  ) {
    return this.postService.deletePostReaction(deletePostReactionData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async createOrUpdatePostReaction(
    @Args('input') createPostReactionData: CreateOrUpdatePostReactionInput,
    @CurrentUser() authUser
  ) {
    return this.postService.createOrUpdatePostReaction(createPostReactionData, authUser.id)
  }
}
