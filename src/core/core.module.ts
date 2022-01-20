import { Module } from '@nestjs/common'
import { AlgoliaService } from './algolia.service'
import { EmailService } from './email.service'
import { FirebaseService } from './firebase.service'
import { PrismaService } from './prisma.service'
import { SendbirdService } from './sendbird.service'

@Module({
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    PrismaService,
    AlgoliaService,
    EmailService,
    SendbirdService,
    FirebaseService,
  ],
  exports: [PrismaService, AlgoliaService, EmailService, SendbirdService, FirebaseService],
})
export class CoreModule {}
