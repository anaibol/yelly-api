import { Injectable } from '@nestjs/common'
import { stringify } from 'qs'
import { PrismaService } from 'src/core/prisma.service'
import expo from '../utils/expo'

const stringifyUserChatParams = (userObject) => {
  const { id, firstName, lastName, pictureId, birthdate } = userObject
  return stringify({
    id,
    firstName,
    lastName,
    pictureId: pictureId || '',
    birthdate: birthdate || '',
  })
}

@Injectable()
export class PushNotificationService {
  constructor(private prismaService: PrismaService) {}

  getUsersByIds(usersId: string[]) {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        expoPushNotificationTokens: {
          select: {
            token: true,
          },
        },
      },
      where: {
        OR: [
          ...usersId.map((userId) => ({
            id: userId,
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
    const users = await this.getUsersByIds(members.map((members) => members.user_id))

    const receiverUsers = users.filter((user) => {
      const senderId = sender.user_id
      const memberID = user.id
      return memberID !== senderId
    })

    const senderUser = users.find((user) => {
      const senderId = sender.user_id
      const memberID = user.id
      return memberID === senderId
    })

    const messages = []
    receiverUsers.forEach((receiverUser) => {
      const url = `${process.env.APP_BASE_URL}/chat/user/${stringifyUserChatParams(senderUser)}`
      receiverUser.expoPushNotificationTokens.forEach((expoPushNotificationToken) => {
        messages.push({
          to: expoPushNotificationToken.token || '',
          title: sender.nickname,
          body: payload.message,
          data: { userId: sender.user_id, unreadCount: 0, url },
        })
      })
    })

    console.log(messages)

    await expo.sendNotifications(messages)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }
}
