import * as DataLoader from 'dataloader'
import { DataloaderProvider } from '@tracworx/nestjs-dataloader'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthUser } from 'src/auth/auth.service'
import { UserService } from './user.service'

@DataloaderProvider()
export class IsFollowedByAuthUserLoader {
  constructor(private userService: UserService) {}

  createDataloader(ctx: GqlExecutionContext) {
    // Fetch request-scoped context data if needed
    const authUser: AuthUser = ctx.getContext().req.user
    // Replace this with your actual dataloader implementation
    return new DataLoader<string, boolean | undefined, string>(async (otherUserIds: readonly string[]) => {
      const isFollowedByAuthUser = await this.userService.isFollowedByAuthUser(authUser.id, otherUserIds as string[]) // skip, limit

      const usersMap = new Map(isFollowedByAuthUser.map((user) => [user.otherUserId, user.isFollowedByAuthUser]))

      return otherUserIds.map((otherUserId) => usersMap.get(otherUserId))
    })
  }
}
