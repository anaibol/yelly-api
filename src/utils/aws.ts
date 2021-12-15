import { v4 as uuidv4 } from 'uuid'

import { S3Client, S3ClientConfig, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

export type IGetUploadPresignedUrl = '/test' | '/avatar'

export const getPresignedUrl = async (folder?: IGetUploadPresignedUrl): Promise<string> => {
  const id: string = uuidv4()
  const key: string = folder ? folder + id : id

  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key })
  const options = { expiresIn: 15 * 60 } // expires after 15 minutes

  return getSignedUrl(s3, command, options)
}
