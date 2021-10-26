import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { AlgoliaService } from './services/algolia.service';

@Module({
  providers: [PrismaService, AlgoliaService],
  exports: [PrismaService, AlgoliaService],
})
export class CoreModule {}
