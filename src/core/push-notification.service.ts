import { Injectable } from '@nestjs/common'
import { ExpoPushNotificationAccessToken, Follower, NotificationType, Tag } from '@prisma/client'
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

  async followeeCreatedTag(tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id: tagId },
      select: {
        text: true,
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
        body: await this.i18n.translate('notifications.followeeCreatedTag', {
          ...(lang && { lang }),
          args: { otherUserFirstName: tag.author?.firstName, tagText: tag.text },
        }),
        data: { url: `${process.env.APP_BASE_URL}/tag/${tagId}` },
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

  async repliedToYourPost(postId: bigint) {
    const postReply = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        author: {
          select: UserPushTokenSelect,
        },
        parent: {
          select: {
            id: true,
            tags: {
              select: {
                id: true,
                text: true,
              },
            },
            author: {
              select: UserPushTokenSelect,
            },
          },
        },
      },
    })

    if (!postReply?.parent?.author) return Promise.reject(new Error('Parent not found'))

    if (postReply.parent.author.id === postReply.author.id) return

    const lang = postReply.parent.author.locale

    const expoPushNotificationTokens = postReply.parent.author
      .expoPushNotificationTokens as ExpoPushNotificationAccessToken[]

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body:
        postReply.parent.tags.length > 0
          ? await this.i18n.translate('notifications.repliedToYourPost', {
              ...(lang && { lang }),
              args: { otherUserFirstName: postReply.author.firstName, tagText: postReply.parent.tags[0].text },
            })
          : await this.i18n.translate('notifications.repliedToYourPostNoTag', {
              ...(lang && { lang }),
              args: { otherUserFirstName: postReply.author.firstName },
            }),
      data: { url: `${process.env.APP_BASE_URL}/post/${postReply.parent.id}` },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'PUSH_NOTIFICATION_REPLIED_TO_YOUR_POST')

    const samePostRepliedUsers = await this.prismaService.user.findMany({
      where: {
        id: {
          not: postReply.author.id,
        },
        posts: {
          some: {
            parentId: postReply.parent.id,
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
        body:
          postReply.parent && postReply.parent.tags.length > 0
            ? await this.i18n.translate('notifications.repliedToSamePostAsYou', {
                ...(lang && { lang }),
                args: { otherUserFirstName: postReply.author.firstName, tagText: postReply.parent?.tags[0].text },
              })
            : await this.i18n.translate('notifications.repliedToSamePostAsYouNoTag', {
                ...(lang && { lang }),
                args: { otherUserFirstName: postReply.author.firstName },
              }),
        data: { url: `${process.env.APP_BASE_URL}/post/${postReply.parent?.id}` },
        sound: 'default' as const,
      }
    })

    const notificationsToSend = await Promise.all(samePostRepliedUsersPushNotifications)

    await this.sendNotifications(
      notificationsToSend,
      samePostRepliedUsers.map(({ expoPushNotificationTokens }) => expoPushNotificationTokens).flat(),
      'PUSH_NOTIFICATION_REPLIED_TO_SAME_POST_AS_YOU'
    )
  }

  async yourTagIsTrending(tagId: bigint) {
    const tag = await this.prismaService.tag.findUnique({
      where: { id: tagId },
      include: {
        author: {
          select: UserPushTokenSelect,
        },
      },
    })

    if (!tag?.author) return Promise.reject(new Error('No tag'))

    const { locale: lang, expoPushNotificationTokens } = tag.author

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.yourTagIsTrending', {
        ...(lang && { lang }),
      }),
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'PUSH_NOTIFICATION_YOUR_TAG_IS_TRENDING')

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async thereAreNewPostsOnYourTag(tagAuthorId: string, tagId: bigint, newPostCount: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: tagAuthorId },
      select: UserPushTokenSelect,
    })

    if (!user) return Promise.reject(new Error('No user'))

    const { locale: lang, expoPushNotificationTokens } = user

    const url = `${process.env.APP_BASE_URL}/tag/${tagId}`

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.thereAreNewPostsOnYourTag', {
        ...(lang && { lang }),
        args: { newPostCount },
      }),
      sound: 'default' as const,
      data: { url },
    }

    await this.sendNotifications(
      [message],
      expoPushNotificationTokens,
      'PUSH_NOTIFICATION_THERE_ARE_NEW_POSTS_ON_YOUR_TAG'
    )

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async isNowFollowingYou(follower: Follower) {
    const getFollowerUser = this.prismaService.user.findUnique({
      select: {
        id: true,
        firstName: true,
      },
      where: { id: follower.userId },
    })

    const getReceiverUser = this.prismaService.user.findUnique({
      select: UserPushTokenSelect,
      where: { id: follower.followeeId },
    })

    const [followerUser, receiverUser] = await Promise.all([getFollowerUser, getReceiverUser])

    if (!followerUser || !receiverUser) return Promise.reject(new Error('followerUser or receiverUser not found'))

    const url = `${process.env.APP_BASE_URL}/user/${followerUser.id}`

    const { locale: lang, expoPushNotificationTokens, id: userId } = receiverUser

    const message = {
      to: expoPushNotificationTokens.map(({ token }) => token),
      body: await this.i18n.translate('notifications.isNowFollowingYou', {
        ...(lang && { lang }),
        args: { otherUserFirstName: followerUser.firstName },
      }),
      data: { userId, url },
      sound: 'default' as const,
    }

    await this.sendNotifications([message], expoPushNotificationTokens, 'PUSH_NOTIFICATION_IS_NOW_FOLLOWING_YOU')

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  }

  async sendNotifications(
    messages: ExpoPushMessage[],
    tokens: ExpoPushNotificationAccessToken[],
    trackEventPrefix: TrackEventPrefix
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
            //     .translate('notifications.promotedTag', { ...(lang && { lang }) })
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

  async reactedToYourTag(tagReactionId: bigint) {
    const tagReaction = await this.prismaService.tagReaction.findUnique({
      where: {
        id: tagReactionId,
      },
      select: {
        author: {
          select: {
            firstName: true,
          },
        },
        tag: {
          select: {
            author: {
              select: UserPushTokenSelect,
            },
          },
        },
      },
    })

    if (!tagReaction?.tag?.author) return Promise.reject(new Error('No tag'))

    const pushTokens = await this.getPushTokensByUsersIds([tagReaction.tag.author.id])

    const lang = tagReaction.tag.author.locale

    const message = {
      body: await this.i18n.translate('notifications.reactedToYourTag', {
        args: { otherUserFirstName: tagReaction.author.firstName },
        ...(lang && { lang }),
      }),
    }

    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        ...message,
        to: expoPushNotificationToken.token,
        // data: { url: `${process.env.APP_BASE_URL}/notifications/notifications` },
        sound: 'default' as const,
      }
    })

    await this.sendNotifications(messages, pushTokens, 'PUSH_NOTIFICATION_REACTED_TO_YOUR_TAG')
  }

  async reactedToYourPost(postReactionId: bigint) {
    const postReaction = await this.prismaService.postReaction.findUnique({
      where: {
        id: postReactionId,
      },
      select: {
        author: {
          select: {
            firstName: true,
          },
        },
        post: {
          select: {
            id: true,
            tags: {
              select: {
                id: true,
                text: true,
              },
            },
            author: {
              select: {
                id: true,
                locale: true,
              },
            },
          },
        },
      },
    })

    if (!postReaction?.post?.author) return Promise.reject(new Error('Post author not found'))

    const pushTokens = await this.getPushTokensByUsersIds([postReaction.post.author.id])

    const lang = postReaction.post.author.locale

    const message = {
      body:
        postReaction.post.tags.length > 0
          ? await this.i18n.translate('notifications.reactedToYourPost', {
              args: { otherUserFirstName: postReaction.author.firstName, tagText: postReaction.post.tags[0].text },
              ...(lang && { lang }),
            })
          : await this.i18n.translate('notifications.reactedToYourPostNoTag', {
              args: { otherUserFirstName: postReaction.author.firstName },
              ...(lang && { lang }),
            }),
    }

    const messages = pushTokens.map((expoPushNotificationToken) => {
      return {
        ...message,
        to: expoPushNotificationToken.token,
        data: { url: `${process.env.APP_BASE_URL}/post/${postReaction.post.id}` },
        sound: 'default' as const,
      }
    })

    await this.sendNotifications(messages, pushTokens, 'PUSH_NOTIFICATION_REACTED_TO_YOUR_POST')
  }
}
