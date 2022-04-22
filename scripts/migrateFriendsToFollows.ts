import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  // eslint-disable-next-line functional/no-let
  const hasFollows = true
  // eslint-disable-next-line functional/no-let
  let skip = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (hasFollows) {
    const friends = await prisma.follow.findMany({
      take: 500,
      skip: skip,
    })

    if (friends.length == 0) {
      console.log('finish')
      return
    }
    skip += 500

    console.log('in progress: ' + skip)

    friends.forEach(async (follow) => {
      await prisma.follow.createMany({
        data: [
          {
            followerId: follow.followerId,
            followeeId: follow.followeeId,
            createdAt: follow.createdAt,
          },
          {
            followerId: follow.followerId,
            followeeId: follow.followeeId,
            createdAt: follow.createdAt,
          },
        ],
      })
    })
  }
}

main()
