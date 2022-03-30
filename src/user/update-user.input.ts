import { InputType } from '@nestjs/graphql'
import { IsEmail, MinLength } from 'class-validator'

@InputType()
export class UpdateUserInput {
  firstName?: string
  lastName?: string
  @IsEmail()
  email?: string
  @MinLength(6)
  password?: string
  birthdate?: Date
  instagram?: string
  snapchat?: string
  pictureId?: string
  avatar3dId?: string
  trainingName?: string
  schoolGooglePlaceId?: string
  about?: string
  isFilled?: boolean
}
