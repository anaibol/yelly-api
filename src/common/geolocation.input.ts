import { InputType } from '@nestjs/graphql'

@InputType()
export class GeolocationInput {
  lat: string
  lng: string
}
