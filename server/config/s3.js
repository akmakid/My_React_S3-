import { S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export const bucketName = process.env.AWS_S3_BUCKET

export function getObjectUrl(key) {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}
