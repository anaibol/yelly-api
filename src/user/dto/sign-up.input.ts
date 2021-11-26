import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignUpInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  password: string

  @Field()
  birthdate: Date

  @Field()
  pictureId?: string

  @Field()
  instagram?: string

  @Field()
  snapchat: string

  @Field()
  trainingName: string

  @Field()
  schoolGooglePlaceId: string
}
