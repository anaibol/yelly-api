import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { parse as uuidParse, stringify as uuidStringify } from 'uuid'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    })
  }

  // INFO: The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database. We don't bother with onModuleDestroy, since Prisma has its own shutdown hooks where it will destroy the connection. For more info on enableShutdownHooks, please see Issues with enableShutdownHooks
  async onModuleInit(): Promise<void> {
    await this.$connect()

    this.$use(async (params, next) => {
      const before = Date.now()

      const result = await next(params)

      const after = Date.now()

      console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

      return result
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', async (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log('Query: ' + e.query)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log('Duration: ' + e.duration + 'ms')
    })
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }

  mapBufferIdToString(id: Buffer): string {
    let uuid = ''
    try {
      uuid = uuidStringify(id)
    } catch {
      console.log('uuid : ' + id)
    }
    return uuid
  }
  mapStringIdToBuffer(id: string): Buffer {
    return Buffer.from(uuidParse(id))
  }
}
