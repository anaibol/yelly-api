import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  let hasUsers = true
  let skip = 0
  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          expoPushNotificationToken: null,
        },
      },
      select: {
        id: true,
        expoPushNotificationToken: true,
      },
      skip: skip,
      take: 500,
    })
    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 500

    console.log('insert ' + skip)

    const userData = users.map((user) => {
      return { userId: user.id, token: user.expoPushNotificationToken }
    })
    await prisma.expoPushNotificationAccessToken.createMany({
      data: userData,
    })
  }
}

main()
