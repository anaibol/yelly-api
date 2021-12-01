import { Module } from '@nestjs/common'
import { AlgoliaService } from './algolia.service'
import { EmailService } from './email.service'
import { PrismaService } from './prisma.service'
import { SendbirdService } from './sendbird.service'

@Module({
  providers: [PrismaService, AlgoliaService, EmailService, SendbirdService],
  exports: [PrismaService, AlgoliaService, EmailService, SendbirdService],
})
export class CoreModule {}
