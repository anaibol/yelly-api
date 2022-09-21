import { Identify } from '@amplitude/analytics-node'

import { PrismaClient } from '.prisma/client'

const formatDateToISO8601 = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

async function main() {
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: new Date('2022-7-31'),
      },
    },
    include: {
      _count: {
        select: {
          followers: true,
          followees: true,
          postReactions: true,
          posts: true,
          tags: true,
        },
      },
    },
    //take: 1,
  })

  // TODO: set the Amplitude API Key
  // init(AMPLITUDE_API_KEY)

  console.log('userCount', users.length)

  users.forEach((user) => {
    if (!user) return true

    console.log({
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      createdAt: user.createdAt,
      YEAR_OF_BIRTH: user.birthdate?.getFullYear(),
      FOLLOWERS_COUNT: user._count.followers,
      FOLLOWEES_COUNT: user._count.followers,
      TRENDS_CREATED_COUNT: user._count.tags,
      POST_CREATED_COUNT: user._count.posts,
      POSTS_REACTIONS_GIVEN_COUNT: user._count.postReactions,
      DATE_OF_SIGNUP: formatDateToISO8601(user.createdAt),
      AGE_VERIFIED_WITH_YOTI: !!user.isAgeApproved,
    })

    const identifyObj = new Identify()
    if (user.birthdate) identifyObj.set('YEAR_OF_BIRTH', user.birthdate?.getFullYear())
    identifyObj.set('FOLLOWERS_COUNT', user._count.followers)
    identifyObj.set('FOLLOWEES_COUNT', user._count.followees)
    identifyObj.set('TRENDS_CREATED_COUNT', user._count.tags)
    identifyObj.set('POST_CREATED_COUNT', user._count.posts)
    identifyObj.set('POSTS_REACTIONS_GIVEN_COUNT', user._count.postReactions)
    identifyObj.set('DATE_OF_SIGNUP', formatDateToISO8601(user.createdAt))
    identifyObj.set('AGE_VERIFIED_WITH_YOTI', !!user.isAgeApproved)

    // TODO: uncomment to apply the changes
    // identify(identifyObj, {
    //   user_id: user.id,
    // })
  })
}

main()
