import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType()
export class City {
  @Field(() => ID)
  id: string
  name: string
  googlePlaceId?: string
  lat?: string
  lng?: string
  country?: Country
}
