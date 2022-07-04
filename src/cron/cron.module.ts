import { BullModule, BullQueueInject } from '@anchan828/nest-bullmq'
import { Module, OnModuleInit } from '@nestjs/common'
import { Queue } from 'bullmq'

import { CoreModule } from '../core/core.module'
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

    await this.queue.add('cron', undefined, {
      repeat: {
        every: process.env.NODE_ENV === 'development' ? 30000 : 3600000,
      },
    })
  }
}
