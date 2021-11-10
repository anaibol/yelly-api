import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class City {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  googlePlaceid: string
}
