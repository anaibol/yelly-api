/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '.prisma/client'
import { excludedTags } from '../src/tag/excluded-tags.constant'

async function main() {
  const prisma = new PrismaClient()

  const tags = await prisma.tag.updateMany({
    where: {
      text: {
        in: excludedTags,
      },
    },
    data: {
      isHidden: true,
    },
  })

  console.log({ tags })
}

main()
