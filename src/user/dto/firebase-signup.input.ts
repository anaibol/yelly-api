import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignUpInput {
  @Field()
  accessToken: string

  @Field()
  locale: string
}
