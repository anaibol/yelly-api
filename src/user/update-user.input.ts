import { InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  displayName?: string
  username?: string
  email?: string
  password?: string
  birthdate?: Date
  instagram?: string
  snapchat?: string
  pictureId?: string
  trainingName?: string
  schoolGooglePlaceId?: string
  countryCode?: string
  about?: string
  isFilled?: boolean
}
