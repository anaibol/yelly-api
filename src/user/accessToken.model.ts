import { ObjectType } from '@nestjs/graphql'

import { Tag } from '../tag/tag.model'

@ObjectType()
export class AccessToken {
  accessToken: string
  refreshToken: string
  isNewUser?: boolean
}

@ObjectType()
export class AccessTokenWithTag extends AccessToken {
  tag: Tag
}
