import { Module } from '@nestjs/common'
import { AlgoliaService } from './services/algolia.service'
import { EmailService } from './services/email.service'
import { PrismaService } from './services/prisma.service'

@Module({
  providers: [PrismaService, AlgoliaService, EmailService],
  exports: [PrismaService, AlgoliaService, EmailService],
})
export class CoreModule {}
