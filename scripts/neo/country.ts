import { PrismaClient } from '@prisma/client'
import getNeo from './ogm'

async function main() {
  const prisma = new PrismaClient()

  const { ogmCountry } = await getNeo()

  let hasItems = true
  let skip = 0
  const take = 50
  while (hasItems) {
    const items = await prisma.country.findMany({
      select: {
        id: true,
        code: true,
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
        code: item.code,
      }
    })

    await ogmCountry.create({
      input: itemsMap,
    })

    console.log('insert ' + skip)
  }
}

main()