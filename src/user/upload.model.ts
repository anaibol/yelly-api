import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Upload {
  @Field()
  url: string
  @Field()
  key: string
}
