import { InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  displayName?: string
  username?: string
  email?: string
  password?: string
  instagram?: string
  snapchat?: string
  tiktok?: string
  pictureId?: string
  trainingName?: string
  schoolGooglePlaceId?: string
  countryCode?: string
  about?: string
  isFilled?: boolean
  lastLoginAt?: Date
}
