import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { bucketName, s3Client } from '../config/s3.js'

const PRESIGNED_URL_EXPIRY = 3600

export async function getPresignedViewUrl(key) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
    { expiresIn: PRESIGNED_URL_EXPIRY },
  )
}

export function getFileNameFromKey(key) {
  const base = key.replace(/^uploads\//, '')
  const match = base.match(/^\d+-(.+)$/)
  return match ? match[1] : base
}

export function isImageFile(fileName) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(fileName)
}

export function isPdfFile(fileName) {
  return /\.pdf$/i.test(fileName)
}
