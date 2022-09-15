import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import gql from 'graphql-tag'
import { camelCase } from 'lodash'

import { RequestContext } from './request-context.interceptor'

const parseGraphQLQuery = (query: string) => {
  // eslint-disable-next-line functional/no-try-statement
  try {
    const queryObj: any = gql(query)
    const operationName = queryObj.definitions[0].selectionSet.selections[0].name.value

    return {
      operationName,
      operation: queryObj.definitions[0].operation,
    }
  } catch (e) {
    return {}
  }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readOnlyInstance?: PrismaClient

  constructor() {
    // eslint-disable-next-line functional/no-expression-statement
    super({
      log:
        process.env.NODE_ENV !== 'production'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'info' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ]
          : [],
    })

    this.readOnlyInstance = process.env.DATABASE_READ_URL
      ? new PrismaClient({
          datasources: { db: { url: process.env.DATABASE_READ_URL } },
        })
      : undefined
  }

  async onModuleInit(): Promise<void> {
    await Promise.all([this.$connect(), this.readOnlyInstance?.$connect()])

    this.$use(async (params, next) => {
      const graphQLQuery = RequestContext.ctx?.req.body.query
      const { operation, operationName } = parseGraphQLQuery(graphQLQuery)

      const isGraphQLQuery = operation === 'query'

      console.log({
        requestId: RequestContext.ctx?.requestId,
        isGraphQLQuery,
        operationName,
      })

      if (!params.runInTransaction && params.action !== 'count' && isGraphQLQuery && this.readOnlyInstance) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = await this.readOnlyInstance[camelCase(params.model)][params.action](params.args)
        return res
      }

      const res = await next(params)
      return res
    })

    if (process.env.ENABLE_SQL_LOGS === 'true') {
      this.$use(async (params, next) => {
        const before = Date.now()
        const result = await next(params)
        const after = Date.now()
        console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
        return result
      })
    }

    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // this.$on('query', async (e) => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   const { query, params, duration } = e

    //   if (process.env.FORMAT_SQL_LOGS === 'true') {
    //     console.log(Date.now(), { params, duration })
    //     console.log(format(query))
    //   } else {
    //     console.log({ params, duration, query })
    //   }
    // })
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
