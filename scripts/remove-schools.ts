import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const schools = await prisma.school.findMany({
    select: {
      id: true,
    },
  })

  schools.forEach(async (school) => {
    const countUsers = await prisma.user.count({
      where: {
        schoolId: school.id,
      },
    })

    if (countUsers == 0) {
      console.log(school.id)
      await prisma.school.delete({
        where: {
          id: school.id,
        },
      })
    }
  })
}

main()
