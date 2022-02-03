import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AccessToken {
  accessToken: string
  refreshAccessToken: string
}
