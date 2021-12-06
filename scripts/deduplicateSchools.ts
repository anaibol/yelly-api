import { PrismaClient } from '.prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const groupSchools = await prisma.school.groupBy({
    by: ['googlePlaceId'],
    where: {
      NOT: {
        googlePlaceId: null,
      },
    },
    _count: {
      id: true,
    },
    having: {
      id: {
        _count: {
          gt: 1,
        },
      },
    },
  })

  groupSchools.forEach(async (groupSchool) => {
    const schools = await prisma.school.findMany({
      where: {
        googlePlaceId: groupSchool.googlePlaceId,
      },
      include: {
        // userTraining: {
        //   select: {
        //     id: true,
        //     createdAt: true,
        //   },
        // },
      },
    })
    const schoolName = schools[0].name
    const schoolId = schools[0].id

    schools.forEach(async (school) => {
      await prisma.userTraining.updateMany({
        where: {
          schoolId: school.id,
        },
        data: {
          schoolId: schoolId,
        },
      })

      if (school.id != schoolId) {
        await prisma.school.delete({
          where: {
            id: school.id,
          },
        })
      }
    })

    console.log(schoolName)
  })
}

main()
