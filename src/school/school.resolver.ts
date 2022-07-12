import { Args, Query, Resolver } from '@nestjs/graphql'

import { SchoolArgs } from './school.args'
import { School } from './school.model'
import { SchoolService } from './school.service'

@Resolver(School)
export class SchoolResolver {
  constructor(private schoolService: SchoolService) {}

  @Query(() => School, { nullable: true })
  async school(@Args() schoolArgs: SchoolArgs) {
    const { id, googlePlaceId } = schoolArgs

    return this.schoolService.getSchool(id, googlePlaceId)
  }
}
