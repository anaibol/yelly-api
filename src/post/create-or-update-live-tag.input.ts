import { InputType } from '@nestjs/graphql'

@InputType()
export class CreateOrUpdateLiveTagInput {
  text: string
  isLive: boolean
}
