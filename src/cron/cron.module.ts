import { BullModule, BullQueueInject } from '@anchan828/nest-bullmq'
import { Module, OnModuleInit } from '@nestjs/common'
import { Queue } from 'bullmq'

import { CoreModule } from '../core/core.module'
import { RESET_HOURS } from '../utils/dates'
import { CronQueue, CronWorker } from './cron.service'

const APP_QUEUE = 'APP_QUEUE'

@Module({
  imports: [
    CoreModule,
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

    await this.queue.add('sendDailyReminder', undefined, {
      repeat: {
        cron: `0 ${RESET_HOURS} * * *`,
        tz: 'Europe/Paris',
      },
    })

    await this.queue.add('computeTagRanking', undefined, {
      repeat: {
        cron: `0 ${RESET_HOURS} * * *`,
        tz: 'Europe/Paris',
      },
    })
  }
}
