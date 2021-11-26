import { Module } from '@nestjs/common'
import { AlgoliaService } from './services/algolia.service'
import { EmailService } from './services/email.service'
import { PrismaService } from './services/prisma.service'
import { SendbirdService } from './services/sendbird.service'

@Module({
  providers: [PrismaService, AlgoliaService, EmailService, SendbirdService],
  exports: [PrismaService, AlgoliaService, EmailService, SendbirdService],
})
export class CoreModule {}
