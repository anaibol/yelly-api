import { InputType } from '@nestjs/graphql'

@InputType()
export class UpdateTagInput {
  isHidden?: boolean
  scoreFactor?: number
}
