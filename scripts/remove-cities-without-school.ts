import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  const cities = await prisma.city.findMany({
    select: {
      id: true,
    },
    take: 2000,
    skip: 6000,
  })

  cities.forEach(async (city) => {
    const countSchool = await prisma.school.count({
      where: {
        cityId: city.id,
      },
    })

    if (countSchool == 0) {
      console.log(city.id)
      await prisma.city.delete({
        where: {
          id: city.id,
        },
      })
    }
  })
}

main()
