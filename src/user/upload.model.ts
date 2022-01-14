import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Upload {
  url: string
  key: string
}
