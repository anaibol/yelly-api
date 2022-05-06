/* eslint-disable functional/immutable-data */
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as Amplitude from '@amplitude/node'
import { TrackEventPrefix } from 'src/types/trackEventPrefix'

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
  logEvent(event: string, userId: string) {
    return this.client.logEvent({
      event_type: event,
      user_id: userId,
    })
  }
}
