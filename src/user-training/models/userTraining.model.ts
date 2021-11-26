import { Field, ObjectType } from '@nestjs/graphql'
import { School } from 'src/user-training/models/school.model'
import { Training } from 'src/user-training/models/training.model'

@ObjectType()
export class UserTraining {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field((type) => Training, { nullable: true })
  training?: Training

  @Field((type) => School, { nullable: true })
  school?: School
}
