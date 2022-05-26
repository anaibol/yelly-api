import { Module } from '@nestjs/common'
import { CoreModule } from 'src/core/core.module'
import { RankingService } from './ranking.service'

@Module({
  imports: [CoreModule],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
