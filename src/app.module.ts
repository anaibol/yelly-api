import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule, registerEnumType } from '@nestjs/graphql'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginUsageReporting } from 'apollo-server-core'
import { I18nModule } from 'nestjs-i18n'
import { join } from 'path'

// import { CommonFriendsLoader } from './user/common-friends.loader'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { CoreModule } from './core/core.module'
import { CronModule } from './cron/cron.module'
import { NotificationModule } from './notification/notification.module'
import { PostModule } from './post/post.module'
// import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BigIntScalar } from './scalars/big-int.scalar'
import { TagModule } from './tag/tag.module'
import { UserModule } from './user/user.module'

// eslint-disable-next-line functional/immutable-data
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// eslint-disable-next-line functional/immutable-data
process.env.TZ = 'Europe/Paris'

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}
registerEnumType(SortDirection, {
  name: 'SortDirection',
})

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
      cors: process.env.NODE_ENV !== 'production' ? { origin: '*', credentials: true } : false,
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
    PostModule,
    TagModule,
    CoreModule,
    CommonModule,
    AuthModule,
    NotificationModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'es-*': 'es',
        'fr-*': 'fr',
      },
      loaderOptions: {
        path: join(process.cwd(), 'src/i18n'),
        watch: true,
      },
    }),
  ],
})
export class AppModule {}
