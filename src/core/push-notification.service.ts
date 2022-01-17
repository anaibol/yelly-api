import { Injectable } from '@nestjs/common'
import { Tag, PostComment, PostReaction } from '@prisma/client'
import { ExpoPushErrorReceipt } from 'expo-server-sdk'
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

  async postComment(postComment: Partial<PostComment>) {
    const { authorId: postAuthorID } = await this.prismaService.post.findUnique({
      where: {
        id: postComment.postId,
      },
      select: {
        authorId: true,
      },
    })

    const pushTokens = await this.getPushTokensByUsersIds([postAuthorID])

    const { firstName: commenterFirstName } = await this.prismaService.user.findUnique({
      where: { id: postComment.authorId },
    })

    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        to: expoPushNotificationToken.token,
        body: `${commenterFirstName} a commenté ton post`,
        data: { url: `${process.env.APP_BASE_URL}/post/${postComment.postId}` },
        sound: 'default' as const,
      }
    })

    await expo.sendNotifications(messages)
  }

  async newLiveTag(liveTag: Tag) {
    const allPushTokens = await this.prismaService.expoPushNotificationAccessToken.findMany({
      select: {
        token: true,
        userId: true,
      },
    })

    const messages = allPushTokens.map(({ token }) => {
      return {
        to: token,
        title: 'Yelly',
        body: 'Viens découvrir le nouveau # du jour 👀⚡️',
        // data: { userId: sender.user_id, unreadCount: 0, url },
        sound: 'default' as const,
      }
    })

    const results = await expo.sendNotifications(messages)

    // results.map((result) => {
    //   if (result.status === 'rejected') {
    //     const error = result.reason as ExpoPushErrorReceipt

    //     if (error.details.error === 'DeviceNotRegistered') {
    //       this.prismaService.expoPushNotificationAccessToken.delete({
    //         where: {
    //           token: asd.token,
    //         }
    //       }),
    //     }
    //   }
    // })
  }
}
