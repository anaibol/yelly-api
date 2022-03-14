import { PrismaClient, User } from '@prisma/client'
import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api-3DDF6540-52AA-4CCC-95D4-04D7F3C0DF14.sendbird.com',
  headers: {
    'Content-Type': 'application/json; charset=utf8',
    'Api-Token': '65e06d42e8da1a785fce5ea24ea2c976bb618510',
  },
})

async function main() {
  const prisma = new PrismaClient()

  let hasUsers = true
  let skip = 0

  const updateOrCreateUser = async (user: Partial<User>) => {
    console.log(`Tryin to update or create sb user with the id ${user.id}`)

    const profileUrl = user.pictureId && `http://yelly.imgix.net/${user.pictureId}?format=auto`

    const sendbirdUser = {
      user_id: user.id,
      nickname: user.firstName + ' ' + user.lastName,
      profile_url: profileUrl,
      issue_access_token: true,
    }

    const metadata = {
      firstName: user.firstName,
      lastName: user.lastName,
      pictureId: user.pictureId || '',
    }

    try {
      const updatedUser = await client.put(`/v3/users/${user.id}`, sendbirdUser)

      await client.put(`/v3/users/${user.id}/metadata`, { metadata, upsert: true })
      if (updatedUser) {
        await prisma.user.update({
          where: { id: user.id },
          data: { sendbirdAccessToken: updatedUser.data.access_token },
        })

        return `updated: ${user.id}`
      }
    } catch (error) {
      const createdUser = await client.post(`/v3/users`, { ...sendbirdUser, ...metadata })

      await prisma.user.update({
        where: { id: user.id },
        data: { sendbirdAccessToken: createdUser.data.access_token },
      })

      return `created: ${user.id}`
    }
  }

  while (hasUsers) {
    const users = await prisma.user.findMany({
      where: { sendbirdAccessToken: null, isFilled: true },
      select: { id: true, sendbirdAccessToken: true, firstName: true, lastName: true, pictureId: true },
      skip,
      take: 10,
    })

    if (users.length == 0) {
      hasUsers = false
      console.log('finish')
      return
    }
    skip += 10

    console.log('users.length:', users.length)
    await Promise.all(users.map(async (user) => await updateOrCreateUser(user)))
  }
}

main()
