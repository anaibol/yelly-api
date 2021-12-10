import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { PushNotificationService } from '../core/push-notification.service'
import { Response } from 'express'

@ObjectType()
export class Notification {
  @Field()
  category: string
}

@Controller('notifications')
export class SendbirdWebhookController {
  constructor(private pushNotificationService: PushNotificationService) {}

  @Post('/chat-message')
  async chatMessage(@Body() body: Notification, @Res() response: Response) {
    await this.pushNotificationService.chatMessage(body)
    response.status(HttpStatus.OK).send()
  }
}
