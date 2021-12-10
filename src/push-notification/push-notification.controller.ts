import { Body, Controller, Post } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { PushNotificationService } from './push-notification.service'

@ObjectType()
export class Notification {
  @Field()
  category: string
}

@Controller('notifications')
export class PushNotificationController {
  constructor(private pushNotificationService: PushNotificationService) {}

  @Post('/chat-message')
  async chatMessage(@Body() body: Notification): Promise<Notification> {
    console.log('body:', body)
    this.pushNotificationService.chatMessage(body)
    return body
  }
}
