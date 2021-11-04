import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { UserService } from './services/user.service';

@Module({
  imports: [CoreModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
