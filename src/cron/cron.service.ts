/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statement */
import { BullQueueInject, BullWorker, BullWorkerProcess } from '@anchan828/nest-bullmq'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bullmq'
import { RankingService } from 'src/ranking/ranking.service'
import { PrismaService } from '../core/prisma.service'

const APP_QUEUE = 'APP_QUEUE'

@Injectable()
export class CronQueue {
  constructor(
    @BullQueueInject(APP_QUEUE)
    private readonly queue: Queue
  ) {}
}

@BullWorker({ queueName: APP_QUEUE, options: { concurrency: 1 } })
export class CronWorker {
  constructor(private prismaService: PrismaService, private rankingService: RankingService) {}

  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    console.log('APP_QUEUE CRON RUN', { date: new Date() })

    try {
      const tags = await this.prismaService.tag.findMany({
        where: {
          isHidden: false,
        },
      })

      // eslint-disable-next-line functional/no-loop-statement
      for (let index = 0; index < tags.length; index++) {
        const tag = tags[index]

        await this.rankingService.recalculateTagRank(tag)
      }

      return { status: 'ok' }
    } catch (error) {
      console.log({ error })

      return { status: 'error' }
    }
  }
}
