import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  // eslint-disable-next-line functional/no-let
  const hasFollows = true
  // eslint-disable-next-line functional/no-let
  let skip = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (hasFollows) {
    const friends = await prisma.friend.findMany({
      take: 500,
      skip: skip,
    })

    if (friends.length == 0) {
      console.log('finish')
      return
    }
    skip += 500

    console.log('in progress: ' + skip)

    await prisma.follow.createMany({
      data: friends.map((friend) => ({
        followerId: friend.userId,
        followeeId: friend.otherUserId,
        createdAt: friend.createdAt,
      })),
    })
  }
}

main()
