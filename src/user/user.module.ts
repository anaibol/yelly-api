import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UserService } from './services/user.service';

@Module({
  imports: [PostModule],
  providers: [UserService],
})
export class UserModule {}
