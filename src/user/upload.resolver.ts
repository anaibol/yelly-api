import { Mutation, Resolver } from '@nestjs/graphql'

import { getPresignedUploadUrl } from '../utils/aws'

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async getS3PresignedUrls() {
    return getPresignedUploadUrl('/avatar')
  }
}
