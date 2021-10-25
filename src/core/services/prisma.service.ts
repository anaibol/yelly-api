import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // INFO: The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database. We don't bother with onModuleDestroy, since Prisma has its own shutdown hooks where it will destroy the connection. For more info on enableShutdownHooks, please see Issues with enableShutdownHooks
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  mapBufferIdToString(id: Buffer): string {
    return uuidStringify(id);
  }
  mapStringIdToBuffer(id: string): Buffer {
    return Buffer.from(uuidParse(id));
  }
}
