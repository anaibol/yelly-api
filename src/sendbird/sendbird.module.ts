import { Module } from '@nestjs/common'
import { HttpModule } from 'nestjs-http-promise'
import { PrismaService } from 'src/core/prisma.service'
import { SendbirdService } from './sendbird.service'

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.SENDBIRD_BASE_URL + '/v3/',
      headers: {
        'Content-Type': 'application/json; charset=utf8',
        'Api-Token': process.env.SENDBIRD_TOKEN,
      },
    }),
  ],
  providers: [SendbirdService, PrismaService],
  exports: [SendbirdService, HttpModule],
})
export class SendbirdModule {}
