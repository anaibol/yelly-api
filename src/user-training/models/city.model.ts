import { Field, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType()
export class City {
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
  country: Country
}
