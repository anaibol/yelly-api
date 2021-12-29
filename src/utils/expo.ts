import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk'
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

const sendNotifications = (messages: ExpoPushMessage[]): Promise<PromiseSettledResult<ExpoPushTicket[]>[]> => {
  const chunks = expo.chunkPushNotifications(messages)
  const tickets = chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))

  return Promise.allSettled(tickets)
}

export default {
  sendNotifications,
}
