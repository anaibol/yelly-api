// import { PrismaClient } from '.prisma/client'

// async function main() {
//   const prisma = new PrismaClient()

//   let hasSchools = true
//   while (hasSchools) {
//     const schools = await prisma.school.findMany({
//       where: {
//         googlePlaceId: null,
//       },
//       take: 500,
//       skip: 0,
//     })
//     if (schools.length == 0) {
//       hasSchools = false
//       console.log('finish')
//       return
//     }

//     // delete user training where
//     schools.forEach(async (school) => {
//       console.log(school.name)

//       await prisma.userTraining.deleteMany({
//         where: {
//           schoolId: school.id,
//         },
//       })

//       await prisma.school.delete({
//         where: {
//           id: school.id,
//         },
//       })
//     })
//   }
// }

// main()
