import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { CoreModule } from './core/core.module'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module'
import { NotificationModule } from './notification/notification.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), '../schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    PostModule,
    CoreModule,
    CommonModule,
    AuthModule,
    NotificationModule,
  ],
})
export class AppModule {}
