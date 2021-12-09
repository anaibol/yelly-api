import { Injectable } from '@nestjs/common'
import { PrismaService } from '../core/prisma.service'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { stringify } from 'qs'
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
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  getUsersByIds(usersId: string[]) {
    return this.prismaService.user.findMany({
      where: {
        OR: [
          ...usersId.map((userId) => ({
            id: userId,
          })),
        ],
      },
    })
  }

  async find(userId: string, currentCursor, limit = DEFAULT_LIMIT) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userTargetId: userId,
      },
      ...(currentCursor && {
        cursor: {
          createdAt: new Date(+currentCursor).toISOString(),
        },
        skip: 1, // Skip the cursor
      }),
      select: {
        id: true,
        action: true,
        createdAt: true,
        isSeen: true,
        userSource: {
          select: {
            id: true,
            firstName: true,
            pictureId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    const cursor = notifications.length === limit ? notifications[limit - 1].createdAt : ''

    return { notifications, cursor }
  }

  async countUnreadNotifications(userTargetId: string) {
    return this.prismaService.notification.count({
      where: {
        userTargetId,
        isSeen: false,
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

    const messages = receiverUsers.map((receiverUser) => {
      const url = `${process.env.APP_BASE_URL}/chat/user/${stringifyUserChatParams(senderUser)}`

      return {
        to: receiverUser.expoPushNotificationToken || '',
        title: sender.nickname,
        body: payload.message,
        data: { userId: sender.user_id, unreadCount: 0, url },
      }
    })

    await expo.sendNotifications(messages)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }
}
