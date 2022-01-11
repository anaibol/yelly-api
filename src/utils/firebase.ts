import { initializeApp, cert } from 'firebase-admin/app'

const initFirebaseApp = () => {
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  })
}

export default initFirebaseApp
