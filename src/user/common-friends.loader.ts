// import * as DataLoader from 'dataloader'
// import { DataloaderProvider } from '@tracworx/nestjs-dataloader'
// import { GqlExecutionContext } from '@nestjs/graphql'
// import { AuthUser } from 'src/auth/auth.service'
// import { UserService } from './user.service'
// import { PaginatedUsers } from 'src/post/paginated-users.model'

// @DataloaderProvider()
// export class CommonFriendsLoader {
//   constructor(private userService: UserService) {}

//   createDataloader(ctx: GqlExecutionContext) {
//     // Fetch request-scoped context data if needed
//     const authUser: AuthUser = ctx.getContext().req.user
//     // Replace this with your actual dataloader implementation
//     return new DataLoader<string, PaginatedUsers | undefined, string>(async (otherUserIds: readonly string[]) => {
//       const users = await this.userService.getCommonFriendsMultiUser(authUser, otherUserIds as string[], 0, 10) //skip, limit

//       const usersMap = new Map(users.map((user) => [user.otherUserId, user.commonFriends]))

//       return otherUserIds.map((otherUserId) => usersMap.get(otherUserId))
//     })
//   }
// }
