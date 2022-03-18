/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmUser, ogmSchool, ogmTraining } = await getNeo()

  let hasUsers = true
  let skip = 0
  const take = 50
  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: {
        isFilled: true,
      },
      select: {
        id: true,
        schoolId: true,
        trainingId: true,
      },
      take,
      skip,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const usersMap = users.map((user) => {
      return [
        ogmUser.update({
          where: {
            id: user.id,
          },
          connect: {
            training: {
              where: {
                node: {
                  id: user.trainingId,
                },
              },
            },
            school: {
              where: {
                node: {
                  id: user.schoolId,
                },
              },
            },
          },
        }),

        ogmSchool.update({
          where: {
            id: user.schoolId,
          },
          connect: {
            users: [
              {
                where: {
                  node: {
                    id: user.id,
                  },
                },
              },
            ],
          },
        }),

        ogmTraining.update({
          where: {
            id: user.trainingId,
          },
          connect: {
            users: [
              {
                where: {
                  node: {
                    id: user.id,
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
