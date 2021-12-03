import { NotFoundException } from '@nestjs/common'

export class NotFoundLiveTagException extends NotFoundException {
  constructor(message = `Not found a Live Tag`) {
    super(message)
  }
}
