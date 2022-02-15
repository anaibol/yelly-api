import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  let hasFollowships = true
  let skip = 0
  while (hasFollowships) {
    const followships = await prisma.followship.findMany({
      take: 500,
      skip: skip,
    })

    if (followships.length == 0) {
      hasFollowships = false
      console.log('finish')
      return
    }
    skip += 500

    console.log('in progress: ' + skip)

    followships.forEach(async (followship) => {
      const secondFollowship = await prisma.followship.findMany({
        where: {
          followerId: followship.followeeId,
          followeeId: followship.followerId,
        },
      })

      if (secondFollowship.length) {
        const isFriend = await prisma.friend.findUnique({
          where: {
            userId_otherUserId: { userId: followship.followerId, otherUserId: followship.followeeId },
          },
        })
        if (!isFriend) {
          await prisma.friend.create({
            data: {
              userId: followship.followerId,
              otherUserId: followship.followeeId,
              createdAt: followship.createdAt,
            },
          })
        }
      }
    })
  }
}

main()
