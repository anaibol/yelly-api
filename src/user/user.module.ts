import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { CoreModule } from 'src/core/core.module'
import { UserResolver } from './resolvers/user.resolver'
import { UserService } from './services/user.service'

@Module({
  imports: [CoreModule, AuthModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
