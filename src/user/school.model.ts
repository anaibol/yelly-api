import { Field, ID, ObjectType } from '@nestjs/graphql'
import { City } from './city.model'

@ObjectType()
export class School {
  @Field(() => ID)
  id: string
  name?: string
  googlePlaceId?: string
  lat?: string
  lng?: string
  city?: City
}
