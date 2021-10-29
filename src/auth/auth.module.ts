import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    // INFO: Needs to be loaded in async way to get time to read the env variable
    JwtModule.registerAsync({
      useFactory: () => ({
        publicKey:
          process.env.JWT_PUBLIC_KEY ||
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArBUHviyM+5Tvnhbvrymb\nUvzp/Mih2pvtiAz3yd529hG+1dElREqICmW6CUZW1KEuJHTtOGmjt0+xJNKDzUkQ\nl3T1nwRCIYlU9rxR23NSDkfWPswkTDZNt8PYfSRtJNHR8AxEVhYju+U2EY5KrW/H\n9K49txyYz09QU5zMij5D9EOk6pYf3Om8TV2e1jHusR77oTJCwqbEkbYD1o369BYv\nVMINLt1L+/XQTFvGe8YJGgy/yX40tl+LDdMWJL6c8ECoLhjzwtwnZ2PlLSqi28A8\n1dmg5SaWrn5KcwcL0R0t8O0bmZqOy5DcJADrA805pDvGbuPAr3anc4mk6MxGXF6n\nGQIDAQAB\n-----END PUBLIC KEY-----',
      }),
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
