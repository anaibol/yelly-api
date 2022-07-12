import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CoreModule } from '../core/core.module'
import { TagModule } from '../tag/tag.module'
import { UserModule } from '../user/user.module'
import { ActivityResolver } from './activity.resolver'
import { ActivityService } from './activity.service'

@Module({
  imports: [CoreModule, AuthModule, UserModule, TagModule],
  providers: [ActivityService, ActivityResolver],
  exports: [ActivityService],
})
export class ActivityModule {}
