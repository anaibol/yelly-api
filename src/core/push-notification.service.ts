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

  async createFollowshipPushNotification({ followerId, followeeId }) {
    const url = `${process.env.APP_BASE_URL}/user/${followerId}`

    const followeeUserData = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
        expoPushNotificationTokens: true,
      },
      where: { id: followeeId },
    })

    const followerUserData = await this.prismaService.user.findUnique({
      select: {
        firstName: true,
      },
      where: { id: followerId },
    })

    const message = {
      to: followeeUserData.expoPushNotificationTokens.map(({ token }) => token),
      title: `Vous avez un nouveau suiveur`,
      body: `${followerUserData.firstName} a commencé à te suivre`,
      data: { userId: followeeUserData.id, url },
      sound: 'default' as const,
    }

    await expo.sendNotifications([message])

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }
}
