import { Injectable, OnModuleInit } from '@nestjs/common'
import * as Amplitude from '@amplitude/node'
import { TRACK_EVENT } from 'src/types/trackEvent'

@Injectable()
export class AmplitudeService implements OnModuleInit {
  client: Amplitude.NodeClient

  onModuleInit() {
    this.client = Amplitude.init(process.env.AMPLITUDE_API_KEY, {
      retryClass: new Amplitude.OfflineRetryHandler(process.env.AMPLITUDE_API_KEY),
    })
  }

  logEvent(event: TRACK_EVENT, userId: string) {
    this.client.logEvent({
      event_type: event,
      user_id: userId,
    })
  }
}
