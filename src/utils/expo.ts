import { Expo, ExpoPushMessage } from 'expo-server-sdk'
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

const sendNotifications = (messages: ExpoPushMessage[]) => {
  const chunks = expo.chunkPushNotifications(messages)
  const tickets = chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))

  return Promise.allSettled(tickets)
}

export default {
  sendNotifications,
}
