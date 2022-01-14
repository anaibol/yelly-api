import { InputType } from '@nestjs/graphql'

@InputType()
export class ToggleFollowInput {
  otherUserId: string
  value: boolean
}
