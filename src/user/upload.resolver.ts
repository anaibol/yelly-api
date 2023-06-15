import { Query, Resolver } from '@nestjs/graphql'

import { getPresignedUploadUrl } from '../utils/aws'
import { Upload } from './upload.model'

@Resolver()
export class UploadResolver {
  @Query(() => Upload)
  getS3PresignedUploadUrl() {
    return getPresignedUploadUrl()
  }
}
