import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { CoreModule } from './core/core.module'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module'
import { NotificationModule } from './notification/notification.module'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { PushNotificationService } from './push-notification/push-notification.service'
import { PushNotificationController } from './push-notification/push-notification.controller'
import { PushNotificationModule } from './push-notification/push-notification.module'

@Module({
  imports: [
    CacheModule.register(),
    GraphQLModule.forRoot({
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // typePaths: ['./**/*.gql'],
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
      debug: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), '../schema.gql'),
      sortSchema: true,
      context: ({ req, res }): any => ({ req, res }),
    }),
    UserModule,
    PostModule,
    CoreModule,
    CommonModule,
    AuthModule,
    NotificationModule,
    PushNotificationModule,
  ],
  providers: [PushNotificationService],
  controllers: [PushNotificationController],
})
export class AppModule {}
