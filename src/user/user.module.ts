import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { CoreModule } from 'src/core/core.module'
import { AuthModule } from 'src/auth/auth.module'
import { NotificationService } from 'src/notification/services/notification.service'
import { CityService } from 'src/user-training/services/city.service'
import { SchoolService } from 'src/user-training/services/school.service'
import { TrainingService } from 'src/user-training/services/training.service'
import { userTrainingService } from 'src/user-training/services/user-training.service'

@Module({
  imports: [CoreModule, AuthModule],
  providers: [
    UserService,
    UserResolver,
    NotificationService,
    CityService,
    SchoolService,
    TrainingService,
    userTrainingService,
  ],
  exports: [UserService],
})
export class UserModule {}
