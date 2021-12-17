import { v4 as uuidv4 } from 'uuid'

import { S3Client, S3ClientConfig, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const isLocalEnvironment = process.env.ENVIRONMENT === 'local'

const REGION = 'eu-west-3'
const BUCKET = 'yelly-images'

const s3Configuration: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: REGION,
}
const s3 = new S3Client(s3Configuration)

export interface IGetPresignedUploadUrlResponse {
  url: string
  key: string
}

export const getPresignedUploadUrl = async (): Promise<IGetPresignedUploadUrlResponse> => {
  const prefix = isLocalEnvironment ? 'test/' : ''
  const key: string = prefix + uuidv4()

  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key })
  const options = { expiresIn: 30 * 60 } // expires after 30 minutes

  return {
    url: await getSignedUrl(s3, command, options),
    key,
  }
}
