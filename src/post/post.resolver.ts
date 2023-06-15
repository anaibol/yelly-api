import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { AuthUser } from '../auth/auth.service'
import { AuthGuard } from '../auth/auth-guard'
import { CurrentUser } from '../auth/user.decorator'
import { PrismaService } from '../core/prisma.service'
import { PostService } from '../post/post.service'
import { PostsArgs } from '../posts/posts.args'
import { CreateOrUpdatePostReactionInput } from './create-or-update-post-reaction.input'
import { CreatePostInput } from './create-post.input'
import { CreatePostPollVoteInput } from './create-post-poll-vote.input'
import { DeletePostInput } from './delete-post.input'
import { DeletePostReactionInput } from './delete-post-reaction.input'
import { PaginatedPosts } from './paginated-posts.model'
import { PostArgs } from './post.args'
import { Post, PostPollVote } from './post.model'
// import { CommonFriendsLoader } from './common-friends.loader'
// import { CommonFriendsCountLoader } from './common-friends-count.loader'
import { PostReaction } from './post-reaction.model'

@Resolver(Post)
export class PostResolver {
  constructor(private postService: PostService, private prismaService: PrismaService) {}

  @UseGuards(AuthGuard)
  @Query(() => Post)
  post(@Args() postArgs: PostArgs) {
    const { postId, after, limit, childrenSortBy, childrenSortDirection } = postArgs

    return this.postService.getPost(postId, limit, after, childrenSortBy, childrenSortDirection)
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPosts)
  async posts(@Args() postsArgs: PostsArgs, @CurrentUser() authUser: AuthUser): Promise<PaginatedPosts> {
    return this.postService.getPosts(
      authUser,
      postsArgs.authorId,
      postsArgs.tagId,
      postsArgs.after,
      postsArgs.limit,
      postsArgs.sortBy,
      postsArgs.sortDirection
    )
  }

  @Query(() => PaginatedPosts)
  async postsByTagNanoId(@Args() postsArgs: PostsArgs): Promise<PaginatedPosts> {
    return this.postService.getPostsByTagNanoId(
      postsArgs.authorId,
      postsArgs.tagNanoId,
      postsArgs.after,
      postsArgs.limit,
      postsArgs.sortBy,
      postsArgs.sortDirection
    )
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('input') createPostInput: CreatePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.create(createPostInput, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async trackPostViews(@Args({ name: 'postIds', type: () => [BigInt] }) postIds: bigint[]) {
    return this.postService.trackPostViews(postIds)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args('input') deletePostInput: DeletePostInput, @CurrentUser() authUser: AuthUser) {
    return this.postService.delete(deletePostInput.postId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deletePostReaction(
    @Args('input') deletePostReactionInput: DeletePostReactionInput,
    @CurrentUser() authUser: AuthUser
  ) {
    return this.postService.deletePostReaction(deletePostReactionInput.postId, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostReaction)
  async createOrUpdatePostReaction(
    @Args('input') createPostReactionInput: CreateOrUpdatePostReactionInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<PostReaction> {
    return this.postService.createOrUpdatePostReaction(createPostReactionInput, authUser)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPostPollVote(
    @Args('input') createPostPollVoteInput: CreatePostPollVoteInput,
    @CurrentUser() authUser: AuthUser
  ): Promise<Post> {
    return this.postService.createPollVote(createPostPollVoteInput.postId, createPostPollVoteInput.optionId, authUser)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async authUserPollVote(@Parent() post: Post, @CurrentUser() authUser: AuthUser): Promise<PostPollVote | null> {
    if (!post.pollOptions) return null

    return this.postService.getAuthUserPollVote(post.id, authUser)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  async authUserReaction(@Parent() post: Post, @CurrentUser() authUser: AuthUser): Promise<PostReaction | null> {
    return this.postService.getAuthUserReaction(post.id, authUser)
  }
}
