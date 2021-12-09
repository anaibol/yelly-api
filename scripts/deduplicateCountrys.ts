// import { PrismaClient } from '.prisma/client'

// async function main() {
//   const prisma = new PrismaClient()

//   const groupCountrys = await prisma.country.groupBy({
//     by: ['name'],

//     _count: {
//       id: true,
//     },
//     having: {
//       id: {
//         _count: {
//           gt: 1,
//         },
//       },
//     },
//   })

//   groupCountrys.forEach(async (groupCountry) => {
//     const countrys = await prisma.country.findMany({
//       where: {
//         name: groupCountry.name,
//       },
//     })

//     const countryId = countrys[0].id
//     const countryName = countrys[0].name

//     countrys.forEach(async (country) => {
//       await prisma.city.updateMany({
//         where: {
//           countryId: country.id,
//         },
//         data: {
//           countryId: countryId,
//         },
//       })

//       await prisma.school.updateMany({
//         where: {
//           countryId: country.id,
//         },
//         data: {
//           countryId: countryId,
//         },
//       })

//       if (country.id != countryId) {
//         await prisma.country.delete({
//           where: {
//             id: country.id,
//           },
//         })
//       }
//     })

//     console.log(countryName)
//   })
// }

// main()
