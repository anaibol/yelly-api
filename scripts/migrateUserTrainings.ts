// import { PrismaClient } from '.prisma/client'

// async function main() {
//   const prisma = new PrismaClient()

//   const allUserTrainings = await prisma.userTraining.findMany({
//     where: {
//       userId: {
//         not: null,
//       },
//     },
//     // take: 10,
//   })

//   allUserTrainings.map(async ({ id, userId, schoolId, trainingId }) => {
//     await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         schoolId,
//         trainingId,
//       },
//     })

//     await prisma.userTraining.delete({
//       where: {
//         id,
//       },
//     })
//   })
// }

// main()
