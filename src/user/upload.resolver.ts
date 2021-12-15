import { Mutation, Resolver } from '@nestjs/graphql'

import { getPresignedUrl } from '../utils/aws'

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async getS3PresignedUrls() {
    return getPresignedUrl('/avatar')
  }
}
