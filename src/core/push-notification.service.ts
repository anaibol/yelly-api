import { Injectable } from '@nestjs/common'
import {
  ExpoPushNotificationAccessToken,
  Follower,
  NotificationType,
  PostReaction,
  Tag,
  TagReaction,
} from '@prisma/client'
import { ExpoPushMessage } from 'expo-server-sdk'
import { I18nService } from 'nestjs-i18n'

import { TrackEventPrefix } from '../types/trackEventPrefix'
import { ExpoPushNotificationsTokenService } from '../user/expoPushNotificationsToken.service'
import expo from '../utils/expo'
import { AmplitudeService } from './amplitude.service'
import { PrismaService } from './prisma.service'

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

  async postedOnYourTag(postId: bigint) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        author: {
          select: {
            id: true,
            firstName: true,
          },
        },
        tags: {
          select: {
            author: {
              select: {
                ...UserPushTokenSelect,
              },
            },
          },
        },
      },
    })

    if (!post) return Promise.reject(new Error('Post not found'))

    const tag = post.tags[0]

    if (!tag.author) return

    const lang = tag.author.locale

    await this.sendNotifications(
      [
        {
          to: tag.author.expoPushNotificationTokens.map(({ token }) => token),
          body: await this.i18n.translate('notifications.POSTED_ON_YOUR_TAG', {
            ...(lang && { lang }),
            args: { firstName: post.author.firstName },
          }),
          data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
          sound: 'default' as const,
        },
      ],
      tag.author.expoPushNotificationTokens,
      'PUSH_NOTIFICATION_POSTED_ON_YOUR_TAG'
    )
  }

  async followeeCreatedTag(tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id: tagId },
      select: {
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

    if (!tag?.author) return Promise.reject(new Error('Tag author not found'))

    const followers = tag.author.followers.map(({ user }) => user)

    const followersPushNotifications = followers.map(async (user) => {
      const lang = user.locale

      return {
        to: user.expoPushNotificationTokens.map(({ token }) => token),
        body: await this.i18n.translate('notifications.FOLLOWEE_CREATED_TAG', {
          ...(lang && { lang }),
          args: { firstName: tag.author?.firstName },
        }),
        data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(followersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      followers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_FOLLOWEE_CREATED_TAG'
    )
  }

  async followeePostedOnTag(postId: bigint) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
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

    const followersPushNotifications = followers.map(async (user) => {
      const lang = user.locale

      return {
        to: user.expoPushNotificationTokens.map(({ token }) => token),
        body: await this.i18n.translate('notifications.FOLLOWEE_POSTED_ON_TAG', {
          ...(lang && { lang }),
          args: { firstName: post.author.firstName },
        }),
        data: { url: `${process.env.APP_BASE_URL}/notifications/feed` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(followersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      followers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_FOLLOWEE_POSTED_ON_TAG'
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

    await this.prismaService.notification.createMany({
      data: samePostRepliedUsers.map((user) => ({
        userId: user.id,
        type: NotificationType.REPLIED_TO_SAME_POST_AS_YOU,
        postId,
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

  async newFollowerPushNotification(follower: Follower) {
    const followerUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: follower.userId },
    })

    const receiverUser = await this.prismaService.user.findUnique({
      select: UserPushTokenSelect,
      where: { id: follower.followeeId },
    })

    if (!followerUser || !receiverUser) return Promise.reject(new Error('followerUser or receiverUser not found'))

    const url = `${process.env.APP_BASE_URL}/user/${followerUser.id}`

    const { locale: lang, expoPushNotificationTokens, id: userId } = receiverUser

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.FOLLOW_REQUEST_ACCEPTED_BODY', {
        ...(lang && { lang }),
        args: { firstName: followerUser.firstName },
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

  async checkIfTagIsTrendingTrending(tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      select: {
        id: true,
        author: true,
      },
    })

    if (!tag?.author?.countryId) return Promise.reject(new Error('No country'))

    const topTags = await this.prismaService.tag.findMany({
      where: {
        isHidden: false,
        countryId: tag.author.countryId,
      },
      orderBy: [
        {
          reactions: {
            _count: 'desc',
          },
        },
        {
          createdAt: 'desc' as const,
        },
      ],
      take: 5,
    })

    if (topTags.some(({ id }) => id === tag.id)) {
      await this.prismaService.notification.create({
        data: {
          userId: tag.author.id,
          type: 'YOUR_TAG_IS_TRENDING',
        },
      })
    }
  }

  async newTagReaction(tagReaction: TagReaction) {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id: tagReaction.tagId,
      },
      select: {
        id: true,
        author: true,
      },
    })

    if (!tag?.author) return Promise.reject(new Error('No tag'))

    const {
      author: { id: tagAuthorId, locale },
    } = tag

    const pushTokens = await this.getPushTokensByUsersIds([tagAuthorId])
    const reaction = await this.prismaService.user.findUnique({ where: { id: tagReaction.authorId } })

    if (!reaction) return Promise.reject(new Error('Reaction not found'))

    const lang = locale

    const message = {
      body: await this.i18n.translate('notifications.TAG_REACTION_BODY', {
        args: { firstName: reaction.firstName, tagReaction: tagReaction.text },
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
