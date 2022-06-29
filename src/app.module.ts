import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { I18nModule, I18nJsonParser } from 'nestjs-i18n'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { TagModule } from './tag/tag.module'
import { CoreModule } from './core/core.module'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module'
import { NotificationModule } from './notification/notification.module'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginUsageReporting } from 'apollo-server-core'
import { SendbirdWebhookModule } from './sendbird-webhook/sendbird-webhook.module'
import { SchoolModule } from './school/school.module'
// import { CommonFriendsLoader } from './user/common-friends.loader'
import { FeedModule } from './feed/feed.module'
// import { GraphQLError, GraphQLFormattedError } from 'graphql'

import { BigIntScalar } from './scalars/big-int.scalar'
import { CronModule } from './cron/cron.module'

@Module({
  providers: [BigIntScalar, UserModule], // CommonFriendsLoader
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ...(process.env.NODE_ENV !== 'development'
          ? [
              ApolloServerPluginUsageReporting({
                sendVariableValues: { all: true },
                sendHeaders: { all: true },
                sendUnexecutableOperationDocuments: true,
              }),
            ]
          : []),
      ],
      debug: process.env.NODE_ENV !== 'production',
      // formatError: (error: GraphQLError) => {
      //   const graphQLFormattedError: GraphQLFormattedError = {
      //     message: error?.extensions?.exception?.response?.message || error?.message,
      //     code: error.extensions?.code || 'SERVER_ERROR',
      //     name: error.extensions?.exception?.name || error.name,
      //   }
      //   return graphQLFormattedError
      // },
      // formatError: (error) => {
      //   return {
      //     type: error?.extensions?.type || 'Error',
      //     message: error?.message || '에러 메세지가 없습니다.',
      //     path: error?.path || [],
      //     code: error?.extensions?.code || CtErrorType.InternalServerError,
      //   };
      // },
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      context: ({ req, res }: { req: any; res: any }): any => ({
        req,
        res,
      }),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
    ...(process.env.REDIS_HOST && process.env.REDIS_PORT ? [CronModule] : []),
    UserModule,
    FeedModule,
    PostModule,
    TagModule,
    CoreModule,
    CommonModule,
    AuthModule,
    NotificationModule,
    SendbirdWebhookModule,
    SchoolModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'es-*': 'es',
        'fr-*': 'fr',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: join(process.cwd(), 'src/i18n'),
      },
    }),
  ],
})
export class AppModule {}
