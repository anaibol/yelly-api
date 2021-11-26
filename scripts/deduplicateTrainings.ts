import { PrismaClient } from '.prisma/client'

async function main() {
  const prisma = new PrismaClient()

  const groupTrainings = await prisma.training.groupBy({
    by: ['name'],
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

  groupTrainings.forEach(async (groupTraining) => {
    const trainings = await prisma.training.findMany({
      where: {
        name: groupTraining.name,
      },
    })

    const trainingId = trainings[0].id
    const trainingName = trainings[0].name

    trainings.forEach(async (training) => {
      await prisma.userTraining.updateMany({
        where: {
          trainingId: training.id,
        },
        data: {
          trainingId: trainingId,
        },
      })

      await prisma.userTraining.updateMany({
        where: {
          trainingId: training.id,
        },
        data: {
          trainingId: trainingId,
        },
      })

      if (training.id != trainingId) {
        await prisma.training.delete({
          where: {
            id: training.id,
          },
        })
      }
    })
    console.log(trainingName)
  })
}

main()
