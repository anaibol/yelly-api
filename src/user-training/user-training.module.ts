import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { CoreModule } from 'src/core/core.module'
import { UserService } from 'src/user/services/user.service'
import { UserTrainingResolver } from './resolvers/user-training.resolver'
import { CityService } from './services/city.service'
import { SchoolService } from './services/school.service'
import { TrainingService } from './services/training.service'
import { UserTrainingService } from './services/user-training.service'

@Module({
  imports: [CoreModule, AuthModule],
  providers: [UserTrainingResolver, UserTrainingService, UserService, CityService, SchoolService, TrainingService],
  exports: [UserTrainingService],
})
export class UserTrainingModule {}
