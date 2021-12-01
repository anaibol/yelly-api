import { NotFoundException } from '@nestjs/common'

export class NotFoundUserException extends NotFoundException {
  constructor(message = `Not found User`) {
    super(message)
  }
}
