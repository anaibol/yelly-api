import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { camelCase } from 'lodash'
import { format } from 'sql-formatter'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonlyInstance?: PrismaClient

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

    this.readonlyInstance = process.env.DATABASE_READ_URL
      ? new PrismaClient({
          datasources: { db: { url: process.env.DATABASE_READ_URL } },
        })
      : undefined
  }

  async onModuleInit(): Promise<void> {
    await Promise.all([this.$connect(), this.readonlyInstance?.$connect()])

    if (this.readonlyInstance) {
      this.$use(async (params, next) => {
        if (!params.runInTransaction && params.action.includes('find')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const res = await this.readonlyInstance[camelCase(params.model)][params.action](params.args)
          return res
        }

        const res = await next(params)
        return res
      })
    }

    if (process.env.ENABLE_SQL_LOGS === 'true') {
      // this.$use(async (params, next) => {
      //   const before = Date.now()
      //   const result = await next(params)
      //   const after = Date.now()
      //   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
      //   return result
      // })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$on('query', async (e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { query, params, duration } = e

        if (process.env.FORMAT_SQL_LOGS === 'true') {
          console.log(Date.now(), { params, duration })
          console.log(format(query))
        } else {
          console.log({ params, duration, query })
        }
      })
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
