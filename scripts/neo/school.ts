import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmSchool } = await getNeo()

  let hasItems = true
  let skip = 0
  const take = 50
  while (hasItems) {
    const items = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
        lat: true,
        lng: true,
        cityId: true,
      },
      take,
      skip,
    })

    if (items.length == 0) {
      hasItems = false
      console.log('finish')
      return
    }
    skip += take

    console.log('in progress: ' + skip)

    const itemsMap = items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        googlePlaceId: item.googlePlaceId,
        lat: item.lat,
        lng: item.lng,
        city: {
          connect: {
            where: {
              node: {
                id: item.cityId,
              },
            },
          },
        },
      }
    })

    await ogmSchool.create({
      input: itemsMap,
    })

    console.log('insert ' + skip)
  }
}

main()
