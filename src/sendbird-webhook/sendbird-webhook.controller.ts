import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common'
import { PushNotificationService } from '../core/push-notification.service'
import { Response } from 'express'

type SendbirdMessageWebhookBody = {
  sender: any
  members: any[]
  payload: any
}

@Controller('notifications')
export class SendbirdWebhookController {
  constructor(private pushNotificationService: PushNotificationService) {}

  @Post('/chat-message')
  async chatMessage(@Body() body: SendbirdMessageWebhookBody, @Res() response: Response) {
    await this.pushNotificationService.chatMessage(body)
    response.status(HttpStatus.OK).send()
  }
}
