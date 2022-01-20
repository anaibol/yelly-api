import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import initFirebaseApp from './utils/firebase'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  initFirebaseApp()

  await app.listen(8080)
}

bootstrap()
