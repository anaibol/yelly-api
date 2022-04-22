/* eslint-disable functional/immutable-data */
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as Amplitude from '@amplitude/node'
import { TRACK_EVENT } from 'src/types/trackEvent'

@Injectable()
export class AmplitudeService implements OnModuleInit {
  client: Amplitude.NodeClient

  // eslint-disable-next-line functional/no-return-void
  onModuleInit() {
    this.client = Amplitude.init(process.env.AMPLITUDE_API_KEY, {
      retryClass: new Amplitude.OfflineRetryHandler(process.env.AMPLITUDE_API_KEY),
    })
  }

  // eslint-disable-next-line functional/no-return-void
  logEvent(event: TRACK_EVENT, userId: string) {
    console.log({ key: process.env.AMPLITUDE_API_KEY })

    console.log({
      event_type: event,
      user_id: userId,
    })
    return this.client.logEvent({
      event_type: event,
      user_id: userId,
    })
  }
}
