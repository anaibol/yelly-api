import { Mutation } from '@nestjs/graphql'

import aws from '../utils/aws'

export class UploadResolver {
  @Mutation(() => String)
  async getS3PresignedUrls() {
    return aws.getPresignedUrl()
  }
}
