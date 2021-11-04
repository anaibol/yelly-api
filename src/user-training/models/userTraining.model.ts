import { Field, ObjectType } from '@nestjs/graphql'
import { City } from 'src/city/models/city.model'
import { School } from 'src/school/models/school.model'
import { Training } from 'src/training/models/training.model'

@ObjectType()
export class UserTraining {
  @Field()
  id: string

  @Field()
  dateBegin: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field((type) => City, { nullable: true })
  city?: City

  @Field((type) => School, { nullable: true })
  school?: School

  @Field((type) => Training, { nullable: true })
  training?: Training
}
