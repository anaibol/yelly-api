import { Field, InputType } from '@nestjs/graphql'
import { GeolocationInput } from 'src/common/dto/geolocation.input'

@InputType()
export class CreateSchoolInput {
  @Field()
  name: string

  @Field()
  googlePlaceId: string

  @Field()
  country: string

  @Field()
  postalCode: string

  @Field()
  geolocation: GeolocationInput
}
