import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
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
  }

  // INFO: The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database. We don't bother with onModuleDestroy, since Prisma has its own shutdown hooks where it will destroy the connection. For more info on enableShutdownHooks, please see Issues with enableShutdownHooks
  async onModuleInit(): Promise<void> {
    await this.$connect()

    // if (process.env.NODE_ENV !== 'production') {
    //   this.$use(async (params, next) => {
    //     const before = Date.now()

    //     const result = await next(params)

    //     const after = Date.now()

    //     console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

    //     return result
    //   })

    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   this.$on('query', async (e) => {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     console.log('Query: ' + e.query)
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     console.log('Duration: ' + e.duration + 'ms')
    //   })
    // }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
