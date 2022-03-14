import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmUser } = await getNeo()

  let hasUsers = true
  let skip = 0
  const take = 50
  while (hasUsers) {
    const friends = await prisma.friend.findMany({
      take,
      skip,
    })

    if (friends.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const usersMap = friends.map((friend) => {
      return [
        ogmUser.update({
          where: {
            id: friend.userId,
          },
          connect: {
            friends: [
              {
                where: {
                  node: {
                    id: friend.otherUserId,
                  },
                },
              },
            ],
          },
        }),
        ogmUser.update({
          where: {
            id: friend.otherUserId,
          },
          connect: {
            friends: [
              {
                where: {
                  node: {
                    id: friend.userId,
                  },
                },
              },
            ],
          },
        }),
      ]
    })

    await Promise.all(usersMap.flat())
    console.log('insert ' + skip)
  }
}

main()
