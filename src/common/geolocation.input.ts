import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GeolocationInput {
  @Field()
  lat: string

  @Field()
  lng: string
}
