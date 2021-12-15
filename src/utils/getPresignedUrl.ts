import { v4 as uuidv4 } from 'uuid'

import { S3Client, GetObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

console.log('accessKeyId: ', process.env.AWS_ACCESS_KEY_ID)

const s3Configuration: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'eu-west-3',
}
const s3 = new S3Client(s3Configuration)

const getPresignedUrl = async () => {
  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: '<BUCKET>', Key: uuidv4() }), {
    expiresIn: 15 * 60, // expires in 15 seconds
  })

  console.log('Presigned URL: ', url)
  return url
}

export default { getPresignedUrl }
