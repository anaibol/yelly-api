import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';

@Module({
  imports: [PostModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
