import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PostService } from '../post/post.service'
import { AuthUser } from '../auth/auth.service'
import { CreatePostInput } from './create-post.input'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { DeletePostInput } from './delete-post.input'
import { PostsArgs } from './posts.args'
import { PostArgs } from './post.args'
import { PaginatedPosts } from './paginated-posts.model'
import { Post } from './post.model'
import { CreateCommentInput } from './create-comment.input'

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPosts)
  async posts(@Args() postsArgs: PostsArgs, @CurrentUser() authUser: AuthUser) {
    if (!authUser.countryId || !authUser.birthdate) throw new Error('No user country or no user birthdate')

    const { tag, schoolId, after, limit } = postsArgs
    const { posts, nextCursor } = await this.postService.find(
      authUser.countryId,
      authUser.birthdate,
      tag,
      schoolId,
      after,
      limit
    )

    return { items: posts, nextCursor }
  }

  @UseGuards(AuthGuard)
  @Query(() => Post)
  async post(@Args() PostArgs: PostArgs) {
    return this.postService.getById(PostArgs.id)
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
  @Mutation(() => Boolean)
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
    @CurrentUser() authUser: AuthUser
  ) {
    return this.postService.createOrUpdatePostReaction(createPostReactionData, authUser.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async createPostComment(@Args('input') createPostCommentData: CreateCommentInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.createComment(createPostCommentData, authUser.id)
  }
}
