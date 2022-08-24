/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statement */
import { BullQueueInject, BullWorker, BullWorkerProcess } from '@anchan828/nest-bullmq'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bullmq'

import { PushNotificationService } from '../core/push-notification.service'
import { TagService } from '../tag/tag.service'

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
  constructor(private pushNotificationService: PushNotificationService, private tagServer: TagService) {}

  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    console.log('APP_QUEUE CRON RUN', { date: new Date(), job })

    if (job.name === 'sendDailyReminder') {
      try {
        await this.pushNotificationService.sendDailyReminder()

        return { status: 'ok' }
      } catch (error) {
        console.log({ error })

        return { status: 'error' }
      }
    }

    if (job.name === 'computeTagRanking') {
      try {
        // TODO: tagService.computeTagRanking function

        return { status: 'ok' }
      } catch (error) {
        console.log({ error })

        return { status: 'error' }
      }
    }

    console.log({ error: 'Invalid job name' })
    return { status: 'error' }
  }
}
