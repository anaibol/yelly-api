import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { NotFoundError } from 'rxjs'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { UserService } from 'src/user/services/user.service'
import { UpdateUserTrainingInput } from '../dto/update-user-training.input'
import { UserTraining } from '../models/userTraining.model'
import { CityService } from '../services/city.service'
import { SchoolService } from '../services/school.service'
import { TrainingService } from '../services/training.service'
import { UserTrainingService } from '../services/user-training.service'

@Resolver()
export class UserTrainingResolver {
  constructor(
    private userTrainingService: UserTrainingService,
    private userService: UserService,
    private trainingService: TrainingService,
    private cityService: CityService,
    private schoolService: SchoolService
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => UserTraining)
  async updateAuthUserTraining(
    @Args('id') id: string,
    @Args('input') updateUserTrainingInput: UpdateUserTrainingInput,
    @Context() context
  ) {
    const user = await this.userService.findByEmail(context.req.username)

    const found = await user.userTraining.find((element) => element.id == id)
    if (!found) throw new NotFoundError("it's not your resource")

    let trainingId = null
    if (updateUserTrainingInput.training) {
      const training = await this.trainingService.finfByName(updateUserTrainingInput.training)
      trainingId = !training ? (await this.trainingService.create(updateUserTrainingInput.training)).id : training.id
    }

    let cityId = null
    if (updateUserTrainingInput.city) {
      const city = await this.cityService.findByGooglePlaceId(updateUserTrainingInput.city.googlePlaceId)
      cityId = !city
        ? (
            await this.cityService.create(
              updateUserTrainingInput.city.name,
              updateUserTrainingInput.city.googlePlaceId,
              updateUserTrainingInput.city.geolocation.lat,
              updateUserTrainingInput.city.geolocation.lng
            )
          ).id
        : city.id
    }

    let schoolId = null
    if (updateUserTrainingInput.school) {
      const school = await this.schoolService.findByGooglePlaceId(updateUserTrainingInput.school.googlePlaceId)
      schoolId = !school
        ? (
            await this.schoolService.create(
              updateUserTrainingInput.school.name,
              updateUserTrainingInput.school.googlePlaceId
            )
          ).id
        : school.id
    }

    const dateBegin = updateUserTrainingInput.dateBegin ? updateUserTrainingInput.dateBegin : null

    return await this.userTrainingService.UpdateOneById(id, trainingId, cityId, schoolId, dateBegin)
  }
}
