import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmUser } = await getNeo()

  let hasUsers = true
  let skip = 0
  const take = 50
  while (hasUsers) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        createdAt: true,
      },
      where: {
        isFilled: true,
      },
      take: take,
      skip: skip,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += take

    //console.log('in progress: ' + skip)

    const usersMap = users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureId: user.pictureId,
      }
    })

    await ogmUser.create({
      input: usersMap,
    })

    console.log('insert ' + skip)
  }
}

main()
