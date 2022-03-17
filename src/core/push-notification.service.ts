import { Injectable } from '@nestjs/common'
import { ExpoPushNotificationAccessToken, FriendRequest, PostComment, PostReaction } from '@prisma/client'
import { ExpoPushMessage } from 'expo-server-sdk'
import { I18nService } from 'nestjs-i18n'
import { AuthUser } from 'src/auth/auth.service'
import { PrismaService } from 'src/core/prisma.service'
import { TRACK_EVENT } from 'src/types/trackEvent'
import { ExpoPushNotificationsTokenService } from 'src/user/expoPushNotificationsToken.service'
import expo from '../utils/expo'
import { AmplitudeService } from './amplitude.service'

type SendbirdMessageWebhookBody = {
  sender: any
  members: any[]
  payload: any
}

@Injectable()
export class PushNotificationService {
  constructor(
    private prismaService: PrismaService,
    private expoPushNotificationTokenService: ExpoPushNotificationsTokenService,
    private readonly i18n: I18nService,
    private amplitudeService: AmplitudeService
  ) {}

  getPushTokensByUsersIds(usersId: string[]) {
    return this.prismaService.expoPushNotificationAccessToken.findMany({
      select: {
        id: true,
        token: true,
        userId: true,
        user: {
          select: {
            locale: true,
          },
        },
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

  async chatMessage(body: SendbirdMessageWebhookBody) {
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

    if (!senderUser?.firstName) throw new Error('Sender not found or without firsrtName')

    const logEvent: TRACK_EVENT =
      payload.message_type === 'post_reaction'
        ? 'POST_REACTION_PUSH_NOTIFICATION_SENT'
        : 'CHAT_MESSAGE_PUSH_NOTIFICATION_SENT'

    const messages = receiverUsersTokens.map((expoPushNotificationToken) => {
      const url = `${process.env.APP_BASE_URL}/chats/${senderUser.id}`

      return {
        to: expoPushNotificationToken.token,
        title: senderUser.firstName || '',
        body: payload.message,
        data: { userId: sender.user_id, unreadCount: 0, url },
        sound: 'default' as const,
      }
    })

    await this.sendNotifications(messages, pushTokens, logEvent)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  // NOTE: When user send a reaction currently we send a chat message with sendbird.
  // async postReaction(postReaction: Partial<PostReaction>) {
  //   const author = await this.prismaService.post.findUnique({
  //     where: {
  //       id: postReaction.postId,
  //     },
  //     select: {
  //       authorId: true,
  //       author: {
  //         select: {
  //           locale: true,
  //         },
  //       },
  //     },
  //   })

  //   if (!author) throw new Error('Author not found')

  //   const {
  //     authorId: postAuthorID,
  //     author: { locale },
  //   } = author

  //   const pushTokens = await this.getPushTokensByUsersIds([postAuthorID])
  //   const reaction = await this.prismaService.user.findUnique({ where: { id: postReaction.authorId } })

  //   if (!reaction) throw new Error('Reaction not found')

  //   // TODO: ask for text and setup translations file
  //   const message = {
  //     title: await this.i18n.translate('notifications.POST_REACTION_TITLE', { lang: locale || 'fr' }),
  //     body: await this.i18n.translate('notifications.POST_REACTION_BODY', {
  //       args: { firstName: reaction.firstName, postReaction: postReaction.reaction },
  //       lang: locale || 'fr',
  //     }),
  //   }

  //   const messages = pushTokens.map((expoPushNotificationToken) => {
  //     return {
  //       ...message,
  //       to: expoPushNotificationToken.token,
  //       data: { url: `${process.env.APP_BASE_URL}/post/${postReaction.postId}` },
  //       sound: 'default' as const,
  //     }
  //   })

  //   await this.sendNotifications(messages, pushTokens)
  // }

  async createFriendRequestPushNotification(friendRequest: FriendRequest) {
    const url = `${process.env.APP_BASE_URL}/users/${friendRequest.fromUserId}`

    const receiverUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
        expoPushNotificationTokens: {
          select: {
            token: true,
            id: true,
            userId: true,
          },
        },
        locale: true,
      },
      where: { id: friendRequest.toUserId },
    })

    const friendRequestFromUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: friendRequest.fromUserId },
    })

    if (!receiverUser || !friendRequestFromUser) throw new Error('receiverUser or friendRequestFromUser not found')

    const lang = receiverUser.locale
    const expoPushNotificationTokens = receiverUser.expoPushNotificationTokens as ExpoPushNotificationAccessToken[]

    const message = {
      to: receiverUser.expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.FRIENDSHIP_REQUEST_BODY', {
        ...(lang && { lang }),
        args: { firstName: friendRequestFromUser.firstName },
      }),
      data: { userId: friendRequestFromUser.id, url },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'FRIEND_REQUEST_PUSH_NOTIFICATION_SENT')

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async createFriendRequestAcceptedPushNotification(friendRequest: FriendRequest) {
    const friendRequestToUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: friendRequest.toUserId },
    })

    const receiverUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
        expoPushNotificationTokens: {
          select: {
            token: true,
            id: true,
            userId: true,
          },
        },
        locale: true,
      },
      where: { id: friendRequest.fromUserId },
    })

    if (!friendRequestToUser || !receiverUser) throw new Error('friendRequestToUser or receiverUser not found')

    const url = `${process.env.APP_BASE_URL}/user/${friendRequestToUser.id}`
    const lang = receiverUser.locale
    const expoPushNotificationTokens = receiverUser.expoPushNotificationTokens as ExpoPushNotificationAccessToken[]

    const message = {
      to: receiverUser.expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.FRIENDSHIP_ACCEPTED_BODY', {
        ...(lang && { lang }),
        args: { firstName: friendRequestToUser.firstName },
      }),
      data: { userId: receiverUser.id, url },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async postComment(postComment: Partial<PostComment>) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postComment.postId,
      },
      select: {
        authorId: true,
      },
    })

    if (!post) throw new Error('Post not found')

    const { authorId: postAuthorID } = post

    const pushTokens = await this.getPushTokensByUsersIds([postAuthorID])

    const commentAuthor = await this.prismaService.user.findUnique({
      where: { id: postComment.authorId },
    })

    if (!commentAuthor) throw new Error('User not found')

    const { firstName: commenterFirstName } = commentAuthor

    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        to: expoPushNotificationToken.token,
        body: `${commenterFirstName} a commenté ton post`,
        data: { url: `${process.env.APP_BASE_URL}/posts/${postComment.postId}` },
        sound: 'default' as const,
      }
    })

    await expo.sendNotifications(messages)
  }

  async sendNotifications(
    messages: ExpoPushMessage[],
    tokens: ExpoPushNotificationAccessToken[],
    trackEvent?: TRACK_EVENT
  ): Promise<(boolean[] | undefined)[]> {
    const res = await expo.sendNotifications(messages)

    return res.map((result, index) => {
      if (result.status !== 'fulfilled') return

      const expoPushTickets = result.value
      return expoPushTickets.map((ticket) => {
        if (ticket.status == 'ok') {
          if (trackEvent) this.amplitudeService.logEvent(trackEvent, tokens[index].userId)
          return true
        } else {
          const errorType = ticket.details?.error
          if (errorType === 'DeviceNotRegistered')
            this.expoPushNotificationTokenService.deleteByUserAndToken(tokens[index].userId, tokens[index].token)
          return false
        }
      })
    })
  }

  async newLiveTag(tagId: string, authUser: AuthUser): Promise<void> {
    if (process.env.NODE_ENV === 'development') return

    const tag = await this.prismaService.tag.findUnique({
      where: { id: tagId },
    })

    if (!tag?.countryId) throw new Error('No tag')

    const allPushTokens = await this.prismaService.expoPushNotificationAccessToken.findMany({
      select: {
        id: true,
        token: true,
        userId: true,
        user: {
          select: {
            locale: true,
          },
        },
      },
      where: {
        user: {
          school: {
            city: {
              countryId: tag.countryId,
            },
          },
        },
      },
    })

    const url = `${process.env.APP_BASE_URL}/tags/${tag.text}`

    try {
      const messages = await Promise.all(
        allPushTokens
          .map(async ({ token, user: { locale: lang } }) => {
            return {
              to: token,
              sound: 'default' as const,
              title: await this.i18n
                .translate('notifications.NEW_LIVE_TAG_BODY', { ...(lang && { lang }) })
                .catch((e) => null),
              body: '#' + tag.text,
              data: { url },
            }
          })
          .filter((v) => v)
      )

      // Typescript is not smart to recognize it will never be undefined
      await this.sendNotifications(messages, allPushTokens, 'NEW_LIVE_TAG_PUSH_NOTIFICATION_SENT')
    } catch (e) {
      throw e
    }
  }
}
