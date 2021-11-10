import { Field, InputType } from '@nestjs/graphql'
import { CreateUserTrainingInput } from 'src/user-training/dto/create-user-training.input'

@InputType()
export class UserCreateInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  birthdate: Date

  @Field()
  password: string

  @Field()
  pictureId: string | null

  @Field()
  snapchat: string

  @Field()
  instagram: string
}
