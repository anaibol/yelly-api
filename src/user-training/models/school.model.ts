import { Field, ObjectType } from '@nestjs/graphql'
import { City } from './city.model'

@ObjectType()
export class School {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  googlePlaceId: string

  @Field({ nullable: true })
  lat?: string

  @Field({ nullable: true })
  lng?: string

  @Field({ nullable: true })
  city: City
}
