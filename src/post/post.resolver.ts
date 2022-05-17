import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PostService } from '../post/post.service'
import { AuthUser } from '../auth/auth.service'
import { CreatePostInput } from './create-post.input'
import { DeletePostInput } from './delete-post.input'
import { PostArgs } from './post.args'
import { PaginatedPosts } from './paginated-posts.model'
import { Post, PostPollVote } from './post.model'
import { CreatePostPollVoteInput } from './create-post-poll-vote.input'
import { CursorPaginationArgs } from 'src/common/cursor-pagination.args'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { Loader } from '@tracworx/nestjs-dataloader'
// import { CommonFriendsLoader } from './common-friends.loader'
// import { CommonFriendsCountLoader } from './common-friends-count.loader'
import { AuthUserPostReactionLoader } from './auth-user-post-reaction.loader'
import DataLoader from 'dataloader'
import { PostReaction } from './post-reaction.model'
@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPosts)
  posts(@Args() cursorPaginationArgs: CursorPaginationArgs, @CurrentUser() authUser: AuthUser) {
    const { after, limit } = cursorPaginationArgs

    return this.postService.getPosts(authUser, limit, after)
  }

  @UseGuards(AuthGuard)
  @Query(() => Post)
  post(@Args() postArgs: PostArgs) {
    const { id, after, limit } = postArgs

    return this.postService.getPost(id, limit, after)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') createPostData: CreatePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.create(createPostData, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackPostViews(@Args({ name: 'postsIds', type: () => [String] }) postsIds: string[]) {
    return this.postService.trackPostViews(postsIds)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args('input') deletePostInput: DeletePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.delete(deletePostInput.id, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deletePostReaction(
    @Args('input') deletePostReactionData: DeletePostReactionInput,
    @CurrentUser() authUser: AuthUser
  ) {
    return this.postService.deletePostReaction(deletePostReactionData, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostReaction)
  async createOrUpdatePostReaction(
    @Args('input') createPostReactionData: CreateOrUpdatePostReactionInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<PostReaction> {
    return this.postService.createOrUpdatePostReaction(createPostReactionData, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPostPollVote(
    @Args('input') createPostPollVoteInput: CreatePostPollVoteInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<Post> {
    return this.postService.createPollVote(createPostPollVoteInput.postId, createPostPollVoteInput.optionId, authUser)
  }

  @ResolveField()
  async authUserPollVote(@Parent() post: Post, @CurrentUser() authUser: AuthUser): Promise<PostPollVote | null> {
    if (!post.pollOptions) return null

    return this.postService.getAuthUserPollVote(post.id, authUser)
  }

  @ResolveField()
  async authUserReaction(@Parent() post: Post, @CurrentUser() authUser: AuthUser): Promise<PostReaction | null> {
    return this.postService.getAuthUserReaction(post.id, authUser)
  }

  // @ResolveField()
  // async authUserReaction(
  //   @Parent() post: Post,
  //   @Loader(AuthUserPostReactionLoader) authUserPostReactionLoader: DataLoader<string, number | undefined, string>
  // ): Promise<number> {
  //   const postReaction = await authUserPostReactionLoader.load(post.id)

  //   if (!postReaction) return Promise.reject(new Error('Error'))

  //   return postReaction
  // }
}
