import { Injectable } from '@nestjs/common'
import {
  ExpoPushNotificationAccessToken,
  FollowRequest,
  FeedItemType,
  PostReaction,
  NotificationType,
  Tag,
} from '@prisma/client'
import { ExpoPushMessage } from 'expo-server-sdk'
import { I18nService } from 'nestjs-i18n'
import { PrismaService } from 'src/core/prisma.service'
import { TrackEventPrefix } from 'src/types/trackEventPrefix'
import { ExpoPushNotificationsTokenService } from 'src/user/expoPushNotificationsToken.service'
import expo from '../utils/expo'
import { AmplitudeService } from './amplitude.service'

const expiresInFlash = 60 * 15 // 15m

const UserPushTokenSelect = {
  id: true,
  firstName: true,
  locale: true,
  expoPushNotificationTokens: {
    select: {
      id: true,
      userId: true,
      token: true,
    },
  },
}

@Injectable()
export class PushNotificationService {
  constructor(
    private prismaService: PrismaService,
    private expoPushNotificationTokenService: ExpoPushNotificationsTokenService,
    private i18n: I18nService,
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

  async vanishingPosts() {
    // const users = await this.prismaService.user.findMany({
    //   where: {
    //     isActive: true,
    //     isBanned: false,
    //     posts: {
    //       some: {
    //         expiresAt: {
    //           gt: new Date(new Date(+new Date() + 60000 * 4).toUTCString()), // In more than four minutes
    //           lte: new Date(new Date(+new Date() + 60000 * 5).toUTCString()), // Get UTC date from new Date() and convert to ISO
    //         },
    //       },
    //     },
    //   },
    //   select: UserPushTokenSelect,
    // })
    // const tokens = users.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat()
    // const notifications = users.map(async (user) => {
    //   const lang = user.locale
    //   const to = user.expoPushNotificationTokens.map(({ token }) => token)
    //   return {
    //     to: to,
    //     body: await this.i18n.translate('notifications.YOUR_POST_WILL_VANISH', {
    //       ...(lang && { lang }),
    //     }),
    //     sound: 'default' as const,
    //   }
    // })
    // const notificationsToSend = await Promise.all(notifications)
    // await this.sendNotifications(notificationsToSend, tokens, 'PUSH_NOTIFICATION_POST_VANISHING')
  }

  async followeePosted(postId: bigint) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        expiresIn: true,
        author: {
          select: {
            ...UserPushTokenSelect,
            followers: {
              select: {
                user: {
                  select: UserPushTokenSelect,
                },
              },
            },
          },
        },
      },
    })

    if (!post) return Promise.reject(new Error('Post not found'))

    const followers = post.author.followers.map(({ user }) => user)

    await this.prismaService.feedItem.createMany({
      data: followers.map((user) => ({
        userId: user.id,
        type: FeedItemType.FOLLOWEE_POSTED,
        postId,
      })),
    })

    const followersPushNotifications = followers.map(async (user) => {
      const lang = user.locale

      return {
        to: user.expoPushNotificationTokens.map(({ token }) => token),
        body: await this.i18n.translate(
          `notifications.${post.expiresIn === expiresInFlash ? 'FOLLOWEE_POSTED_EPHEMERAL' : 'FOLLOWEE_POSTED'}`,
          {
            ...(lang && { lang }),
            args: { firstName: post.author.firstName },
          }
        ),
        data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(followersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      followers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_FOLLOWEE_POSTED'
    )
  }

  async sameSchoolPosted(postId: bigint, userId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        expiresIn: true,
        author: {
          select: {
            ...UserPushTokenSelect,
            school: {
              select: {
                users: {
                  where: {
                    id: {
                      not: userId,
                    },
                    followees: {
                      none: {
                        followeeId: userId,
                      },
                    },
                  },
                  select: UserPushTokenSelect,
                },
              },
            },
          },
        },
      },
    })

    if (!post) return Promise.reject(new Error('Post not found'))
    if (!post.author.school) return Promise.reject(new Error('Post author no school found'))

    const sameSchoolUsers = post.author.school?.users

    await this.prismaService.feedItem.createMany({
      data: sameSchoolUsers.map((user) => ({
        userId: user.id,
        type: FeedItemType.SAME_SCHOOL_POSTED,
        postId,
      })),
    })

    const sameSchoolUsersPushNotifications = sameSchoolUsers.map(async (user) => {
      const lang = user.locale

      return {
        to: user.expoPushNotificationTokens.map(({ token }) => token),
        body: await this.i18n.translate(`notifications.SAME_SCHOOL_POSTED`, {
          ...(lang && { lang }),
          args: { firstName: post.author.firstName },
        }),
        data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(sameSchoolUsersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      sameSchoolUsers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_SAME_SCHOOL_POSTED'
    )
  }

  async postReplied(postId: bigint) {
    const postReply = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        author: {
          select: UserPushTokenSelect,
        },
        parent: {
          select: {
            id: true,
            author: {
              select: UserPushTokenSelect,
            },
          },
        },
      },
    })

    if (!postReply?.parent?.author) return Promise.reject(new Error('Parent not found'))

    const { parent, author } = postReply

    if (parent.author.id === author.id) return

    const lang = parent.author.locale
    const expoPushNotificationTokens = parent.author.expoPushNotificationTokens as ExpoPushNotificationAccessToken[]

    await this.prismaService.feedItem.create({
      data: {
        userId: parent.author.id,
        type: FeedItemType.POST_REPLIED,
        postId,
      },
    })

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.POST_REPLIED', {
        ...(lang && { lang }),
        args: { firstName: author.firstName },
      }),
      data: { url: `${process.env.APP_BASE_URL}/post/${parent.id}` },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'PUSH_NOTIFICATION_POST_REPLIED')

    const samePostRepliedUsers = await this.prismaService.user.findMany({
      where: {
        id: {
          not: author.id,
        },
        posts: {
          some: {
            parentId: parent.id,
          },
        },
      },
      select: UserPushTokenSelect,
    })

    await this.prismaService.feedItem.createMany({
      data: samePostRepliedUsers.map((user) => ({
        userId: user.id,
        postId,
        type: FeedItemType.SAME_POST_REPLIED,
      })),
    })

    const samePostRepliedUsersPushNotifications = samePostRepliedUsers.map(async (user) => {
      const lang = user.locale

      return {
        to: user.expoPushNotificationTokens.map(({ token }) => token),
        body: await this.i18n.translate('notifications.SAME_POST_REPLIED', {
          ...(lang && { lang }),
          args: { firstName: author.firstName },
        }),
        data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(samePostRepliedUsersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      samePostRepliedUsers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_SAME_POST_REPLIED'
    )
  }

  async createFollowRequestPushNotification(followRequest: FollowRequest) {
    const url = `${process.env.APP_BASE_URL}/notifications/notifications`

    const receiverUser = await this.prismaService.user.findUnique({
      select: UserPushTokenSelect,
      where: { id: followRequest.toFollowUserId },
    })

    const followRequestRequester = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: followRequest.requesterId },
    })

    if (!receiverUser || !followRequestRequester)
      return Promise.reject(new Error('receiverUser or followRequestRequester not found'))

    const { locale: lang, expoPushNotificationTokens } = receiverUser

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.FOLLOW_REQUEST_PUSH_NOTIFICATION_BODY', {
        ...(lang && { lang }),
        args: { firstName: followRequestRequester.firstName },
      }),
      data: { userId: followRequestRequester.id, url },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'PUSH_NOTIFICATION_FOLLOW_REQUEST')

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async createFollowRequestAcceptedPushNotification(followRequest: FollowRequest) {
    const followRequestToUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: followRequest.toFollowUserId },
    })

    const receiverUser = await this.prismaService.user.findUnique({
      select: UserPushTokenSelect,
      where: { id: followRequest.requesterId },
    })

    if (!followRequestToUser || !receiverUser)
      return Promise.reject(new Error('followRequestToUser or receiverUser not found'))

    const url = `${process.env.APP_BASE_URL}/user/${followRequestToUser.id}`

    const { locale: lang, expoPushNotificationTokens, id: userId } = receiverUser

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.FOLLOW_REQUEST_ACCEPTED_BODY', {
        ...(lang && { lang }),
        args: { firstName: followRequestToUser.firstName },
      }),
      data: { userId, url },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens)

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async sendNotifications(
    messages: ExpoPushMessage[],
    tokens: ExpoPushNotificationAccessToken[],
    trackEventPrefix?: TrackEventPrefix
  ): Promise<PromiseSettledResult<boolean | undefined>[]> {
    const res = await expo.sendNotifications(
      messages.map(({ data, ...message }) => ({
        ...message,
        data: {
          ...data,
          trackEventPrefix,
        },
      }))
    )

    const promises = res
      .map((result, index) => {
        if (result.status !== 'fulfilled') return

        const expoPushTickets = result.value
        return expoPushTickets.map(async (ticket) => {
          if (ticket.status == 'ok') {
            if (trackEventPrefix) await this.amplitudeService.logEvent(trackEventPrefix + '_SENT', tokens[index].userId)
            return true
          } else {
            const errorType = ticket.details?.error

            if (errorType === 'DeviceNotRegistered') {
              await this.expoPushNotificationTokenService.deleteByUserAndToken(
                tokens[index].userId,
                tokens[index].token
              )
              return false
            }
          }
        })
      })
      .flat()

    return Promise.allSettled(promises)
  }

  async promotedTag(tag: Tag): Promise<void> {
    if (process.env.NODE_ENV === 'development') return

    if (!tag?.countryId) return Promise.reject(new Error('No tag'))

    const allPushTokens: { id: string; token: string; locale: string; userId: string }[] = await this.prismaService
      .$queryRaw`
    SELECT "ExpoPushNotificationAccessToken"."userId", "token", "locale" FROM "User", "ExpoPushNotificationAccessToken", "City", "School"
    WHERE "User"."id" = "ExpoPushNotificationAccessToken"."userId"
    AND "User"."schoolId" = "School"."id"
    AND "School"."cityId" = "City"."id"
    AND "City"."countryId" =  ${tag.countryId}`
    const url = `${process.env.APP_BASE_URL}/tags/${tag.text}`

    // eslint-disable-next-line functional/no-try-statement
    try {
      const messages = await Promise.all(
        allPushTokens
          .map(async ({ token, locale: lang }) => {
            return {
              to: token,
              sound: 'default' as const,
              body: 'Debrief ton bac philo sur Yelly! #DebriefBacPhilo',
              data: { url },
            }
            // return {
            //   to: token,
            //   sound: 'default' as const,
            //   title: await this.i18n
            //     .translate('notifications.PROMOTED_TAG_BODY', { ...(lang && { lang }) })
            //     .catch(() => null),
            //   body: '#' + tag.text,
            //   data: { url },
            // }
          })
          .filter((v) => v)
      )

      // Typescript is not smart to recognize it will never be undefined
      await this.sendNotifications(messages, allPushTokens, 'PUSH_NOTIFICATION_PROMOTED_TAG')
    } catch (e) {
      // eslint-disable-next-line functional/no-throw-statement
      throw e
    }
  }

  async newPostReaction(postReaction: PostReaction) {
    const postAuthor = await this.prismaService.post.findUnique({
      where: {
        id: postReaction.postId,
      },
      select: {
        author: {
          select: {
            id: true,
            locale: true,
          },
        },
      },
    })

    if (!postAuthor) return Promise.reject(new Error('Post author not found'))

    const {
      author: { id: postAuthorId, locale },
    } = postAuthor

    await this.prismaService.notification.create({
      data: {
        userId: postAuthorId,
        type: NotificationType.POST_REACTION,
        postReactionId: postReaction.id,
      },
    })

    const pushTokens = await this.getPushTokensByUsersIds([postAuthorId])
    const reaction = await this.prismaService.user.findUnique({ where: { id: postReaction.authorId } })

    if (!reaction) return Promise.reject(new Error('Reaction not found'))

    const lang = locale

    const message = {
      body: await this.i18n.translate('notifications.POST_REACTION_BODY', {
        args: { firstName: reaction.firstName, postReaction: postReaction.text },
        ...(lang && { lang }),
      }),
    }

    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        ...message,
        to: expoPushNotificationToken.token,
        data: { url: `${process.env.APP_BASE_URL}/notifications/notifications` },
        sound: 'default' as const,
      }
    })

    await this.sendNotifications(messages, pushTokens)
  }
}
