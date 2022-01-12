import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignUpInput {
  @Field()
  idToken: string

  @Field()
  locale: string
}
