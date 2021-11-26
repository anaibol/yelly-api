import { PrismaClient } from '.prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const groupCitys = await prisma.city.groupBy({
    by: ['googlePlaceId'],
    where: {
      NOT: {
        googlePlaceId: '',
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

  groupCitys.forEach(async (groupcity) => {
    const citys = await prisma.city.findMany({
      where: {
        googlePlaceId: groupcity.googlePlaceId,
      },
      include: {
        userTraining: {
          select: {
            id: true,
          },
        },
      },
    })
    const cityName = citys[0].name
    const cityId = citys[0].id

    citys.forEach(async (city) => {
      await prisma.userTraining.updateMany({
        where: {
          cityId: city.id,
        },
        data: {
          cityId: cityId,
        },
      })

      if (city.id != cityId) {
        await prisma.city.delete({
          where: {
            id: city.id,
          },
        })
      }
    })

    console.log(cityName)
  })
}

main()
