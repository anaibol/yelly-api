import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  firstName: string

  @Field(() => String, { nullable: true })
  lastName: string

  @Field(() => String, { nullable: true })
  email: string

  @Field(() => String, { nullable: true })
  password: string

  @Field(() => Date, { nullable: true })
  birthdate: Date

  @Field(() => String, { nullable: true })
  instagram: string

  @Field(() => String, { nullable: true })
  snapchat: string

  @Field(() => String, { nullable: true })
  expoPushNotificationToken: string

  @Field(() => String, { nullable: true })
  pictureId: string

  @Field(() => String, { nullable: true })
  trainingName: string

  @Field(() => String, { nullable: true })
  schoolGooglePlaceId: string

  @Field(() => String, { nullable: true })
  about: string

  @Field({ defaultValue: false })
  isFilled: boolean
}
