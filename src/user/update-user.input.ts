import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  @Field()
  firstName?: string
  @Field()
  lastName?: string
  @Field()
  email?: string
  @Field()
  password?: string
  @Field()
  birthdate?: Date
  @Field()
  pictureId?: string
  @Field()
  avatar3dId?: string
  @Field()
  trainingName?: string
  @Field()
  schoolGooglePlaceId?: string
  @Field()
  about?: string
  @Field()
  isFilled?: boolean
  @Field()
  snapchat?: string
  @Field()
  instagram?: string
}
