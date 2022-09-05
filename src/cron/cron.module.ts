import { BullModule, BullQueueInject } from '@anchan828/nest-bullmq'
import { Module, OnModuleInit } from '@nestjs/common'
import { Queue } from 'bullmq'

import { CoreModule } from '../core/core.module'
import { TagModule } from '../tag/tag.module'
import { RESET_HOURS } from '../utils/dates'
import { CronQueue, CronWorker } from './cron.service'

const APP_QUEUE = 'APP_QUEUE'

@Module({
  imports: [
    CoreModule,
    TagModule,
    BullModule.forRoot({
      options: {
        connection: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      },
    }),
    BullModule.registerQueue(APP_QUEUE),
  ],
  providers: [CronQueue, CronWorker],
  exports: [CronQueue, CronWorker],
})
export class CronModule implements OnModuleInit {
  constructor(
    @BullQueueInject(APP_QUEUE)
    private readonly queue: Queue
  ) {}

  async onModuleInit() {
    await this.queue.drain(true)

    // Clean repeatable jobs
    const repeatableJobs = await this.queue.getRepeatableJobs()
    console.log('onModuleInit:repeatableJobs', { repeatableJobs })

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < repeatableJobs.length; i++) {
      const job = repeatableJobs[i]
      await this.queue.removeRepeatable(job.name, { cron: job.cron, tz: job.tz })
    }

    // await this.queue.add('sendDailyReminder', undefined, {
    //   repeat: {
    //     cron: `0 ${RESET_HOURS} * * *`,
    //     tz: 'Europe/Paris',
    //   },
    // })

    await this.queue.add('computeTagRanking', undefined, {
      repeat: {
        cron: `0 ${RESET_HOURS} * * *`,
        tz: 'Europe/Paris',
      },
    })

    const repeatableJobsAfter = await this.queue.getRepeatableJobs()
    console.log('onModuleInit:repeatableJobsAfter', { repeatableJobsAfter })
  }
}
