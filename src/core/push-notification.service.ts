import { Injectable } from '@nestjs/common'
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
    const senderUser = pushTokens.find(({ userId }) => userId === sender.user_id)

    const messages = receiverUsersTokens.map((expoPushNotificationToken) => {
      const url = `${process.env.APP_BASE_URL}/chat/user/${senderUser.userId}`

      return {
        to: expoPushNotificationToken.token || '',
        title: sender.nickname,
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
}
