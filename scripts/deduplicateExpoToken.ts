import { PrismaClient } from '@prisma/client'

async function main() {
  const prismaClient = new PrismaClient()
  let hasTokens = true
  const skip = 0

  while (hasTokens) {
    const rows = await prismaClient.expoPushNotificationAccessToken.groupBy({
      by: ['token'],
      take: 50,
      _count: {
        token: true,
      },
      orderBy: {
        token: 'desc',
      },
      having: {
        token: {
          _count: {
            gt: 1,
          },
        },
      },
    })
    if (!rows.length) {
      hasTokens = false
      console.log('finish')
      return
    }

    rows.forEach(async (row) => {
      const tokens = await prismaClient.expoPushNotificationAccessToken.findMany({
        where: {
          token: row.token,
        },
        select: {
          id: true,
          token: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          user: {
            createdAt: 'asc',
          },
        },
      })

      await prismaClient.expoPushNotificationAccessToken.deleteMany({
        where: {
          NOT: {
            id: tokens.pop().id,
          },
          token: row.token,
        },
      })
      console.log(row.token)
    })
  }
}

main()
