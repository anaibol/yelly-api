import { Resolver, Query, Args } from '@nestjs/graphql'
import { School } from './school.model'
import { SchoolService } from './school.service'
import { SchoolArgs } from './school.args'

@Resolver(School)
export class SchoolResolver {
  constructor(private schoolService: SchoolService) {}

  @Query(() => School, { nullable: true })
  async school(@Args() SchoolArgs: SchoolArgs) {
    const { id, googlePlaceId } = SchoolArgs

    return this.schoolService.getSchool(id, googlePlaceId)
  }
}
