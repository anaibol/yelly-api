import * as DataLoader from 'dataloader'
import { DataloaderProvider } from '@tracworx/nestjs-dataloader'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthUser } from 'src/auth/auth.service'
import { PostService } from './post.service'
import { PostReaction } from './post-reaction.model'

@DataloaderProvider()
export class AuthUserPostReactionLoader {
  constructor(private postService: PostService) {}

  createDataloader(ctx: GqlExecutionContext) {
    // Fetch request-scoped context data if needed
    const authUser: AuthUser = ctx.getContext().req.user
    // Replace this with your actual dataloader implementation
    return new DataLoader<string, PostReaction | undefined, string>(async (postIds: readonly string[]) => {
      const authUserPostReaction = await this.postService.postsUserReactions(postIds as string[], authUser.id) // skip, limit

      const usersMap = new Map(authUserPostReaction.map((post) => [post.postId, post.reaction]))

      return postIds.map((otherUserId) => usersMap.get(otherUserId))
    })
  }
}
