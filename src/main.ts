import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { RequestContextInterceptor } from './core/request-context.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new RequestContextInterceptor())

  await app.listen(8080)
}

bootstrap()
