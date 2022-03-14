import * as DataLoader from 'dataloader'
import { DataloaderProvider } from '@tracworx/nestjs-dataloader'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthUser } from 'src/auth/auth.service'
import { UserService } from './user.service'

@DataloaderProvider()
export class CommonFriendsCountLoader {
  constructor(private userService: UserService) {}

  createDataloader(ctx: GqlExecutionContext) {
    // Fetch request-scoped context data if needed
    const authUser: AuthUser = ctx.getContext().req.user
    // Replace this with your actual dataloader implementation
    return new DataLoader<string, number | undefined, string>(async (otherUserIds: readonly string[]) => {
      const users = await this.userService.getCommonFriendsCountMultiUser(authUser, otherUserIds as string[])

      const usersMap = new Map(users.map((user) => [user.otherUserId, user.count]))

      return otherUserIds.map((otherUserId) => usersMap.get(otherUserId))
    })
  }
}
