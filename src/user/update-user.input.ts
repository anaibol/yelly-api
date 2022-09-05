import { InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  firstName?: string
  lastName?: string
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
