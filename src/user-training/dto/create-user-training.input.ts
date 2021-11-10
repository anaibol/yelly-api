import { Field, InputType } from '@nestjs/graphql'
import { CreateSchoolInput } from 'src/user-training/dto/create-school.input'
import { CreateCityInput } from './create-city.input'

@InputType()
export class CreateUserTrainingInput {
  @Field()
  training: string

  @Field()
  dateBegin: Date

  @Field()
  city: CreateCityInput

  @Field()
  school: CreateSchoolInput
}
