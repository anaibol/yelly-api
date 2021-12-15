import { Mutation } from '@nestjs/graphql'

import { getPresignedUrl } from '../utils/aws'

export class UploadResolver {
  @Mutation(() => String)
  async getS3PresignedUrls() {
    return getPresignedUrl('/test')
  }
}
