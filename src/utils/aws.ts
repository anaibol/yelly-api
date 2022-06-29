/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { v4 as uuidv4 } from 'uuid'

import { S3Client, S3ClientConfig, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Readable } from 'stream'

const isLocalEnvironment = process.env.ENVIRONMENT === 'local'

const REGION = 'eu-west-3'
const BUCKET = 'yelly-images'

const s3Configuration: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: REGION,
  useAccelerateEndpoint: true,
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

export const getObject = async (pictureId: string): Promise<string> => {
  const prefix = isLocalEnvironment ? 'test/' : ''

  const key: string = prefix + pictureId

  const getObjectCommand = new GetObjectCommand({ Bucket: BUCKET, Key: key })

  const response = (await s3.send(getObjectCommand)).Body as Readable

  return streamToString(response)
}

export const deleteObject = async (pictureId: string): Promise<void> => {
  const prefix = isLocalEnvironment ? 'test/' : ''

  const key: string = prefix + pictureId

  const delteObjectCommand = new DeleteObjectCommand({ Bucket: BUCKET, Key: key })

  await s3.send(delteObjectCommand)
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')))
  })
}
