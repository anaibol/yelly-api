import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { TagModule } from './tag/tag.module'
import { CoreModule } from './core/core.module'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module'
import { NotificationModule } from './notification/notification.module'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginUsageReporting } from 'apollo-server-core'
import { PushNotificationService } from './core/push-notification.service'
import { SendbirdWebhookController } from './sendbird-webhook/sendbird-webhook.controller'
import { SchoolModule } from './school/school.module'
@Module({
  imports: [
    CacheModule.register(),
    GraphQLModule.forRoot({
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        process.env.NODE_ENV !== 'development' &&
          ApolloServerPluginUsageReporting({
            sendVariableValues: { all: true },
            sendHeaders: { all: true },
            sendUnexecutableOperationDocuments: true,
          }),
      ].filter((v) => v),
      typePaths: ['./**/*.gql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      debug: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), '../schema.gql'),
      sortSchema: true,
      context: ({ req, res }): any => ({ req, res }),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
    UserModule,
    PostModule,
    TagModule,
    CoreModule,
    CommonModule,
    AuthModule,
    NotificationModule,
    SchoolModule,
  ],
  providers: [PushNotificationService],
  controllers: [SendbirdWebhookController],
})
export class AppModule {}
