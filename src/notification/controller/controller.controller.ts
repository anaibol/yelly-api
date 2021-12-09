import { Controller, Post } from '@nestjs/common'

@Controller('notifications')
export class ControllerController {
  @Post('/chat-message')
  chatMessage(): string {
    return 'something'
  }
}
