import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FirebaseSignUpInput {
  @Field()
  firebaseIdToken: string

  @Field()
  locale: string
}
