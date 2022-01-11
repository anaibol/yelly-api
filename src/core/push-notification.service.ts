import { Injectable } from '@nestjs/common'
import { PostReaction } from '@prisma/client'
import { PrismaService } from 'src/core/prisma.service'
import expo from '../utils/expo'

@Injectable()
export class PushNotificationService {
  constructor(private prismaService: PrismaService) {}

  getPushTokensByUsersIds(usersId: string[]) {
    return this.prismaService.expoPushNotificationAccessToken.findMany({
      select: {
        token: true,
        userId: true,
      },
      where: {
        OR: [
          ...usersId.map((userId) => ({
            userId,
          })),
        ],
      },
    })
  }

  async chatMessage(body) {
    if (!body)
      return {
        statusCode: 404,
      }

    const { sender, members, payload } = body
    const pushTokens = await this.getPushTokensByUsersIds(members.map((members) => members.user_id))
    const receiverUsersTokens = pushTokens.filter(({ userId }) => userId !== sender.user_id)

    const senderUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: sender.user_id },
    })

    const messages = receiverUsersTokens.map((expoPushNotificationToken) => {
      const url = `${process.env.APP_BASE_URL}/chat/user/${senderUser.id}`

      return {
        to: expoPushNotificationToken.token,
        title: senderUser.firstName,
        body: payload.message,
        data: { userId: sender.user_id, unreadCount: 0, url },
        sound: 'default' as const,
      }
    })

    await expo.sendNotifications(messages)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async postReaction(postReaction: Partial<PostReaction>) {
    const { authorId: postAuthorID } = await this.prismaService.post.findUnique({
      where: {
        id: postReaction.postId,
      },
      select: {
        authorId: true,
      },
    })

    const pushTokens = await this.getPushTokensByUsersIds([postAuthorID])
    const reactionUserData = await this.prismaService.user.findUnique({ where: { id: postReaction.authorId } })

    // TODO: ask for text and setup translations file
    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        to: expoPushNotificationToken.token,
        title: 'Tu as une nouvelle réaction',
        body: `${reactionUserData.firstName} vous envoie ${postReaction.reaction}`,
        data: { url: `${process.env.APP_BASE_URL}/post/${postReaction.postId}` },
        sound: 'default' as const,
      }
    })

    await expo.sendNotifications(messages)
  }
}
