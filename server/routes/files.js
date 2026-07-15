import { Router } from 'express'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { bucketName, s3Client } from '../config/s3.js'
import {
  getFileNameFromKey,
  getPresignedViewUrl,
  isImageFile,
  isPdfFile,
} from '../utils/files.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    if (!bucketName) {
      return res.status(500).json({ error: 'AWS_S3_BUCKET is not configured in .env' })
    }

    const result = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: 'uploads/',
      }),
    )

    const objects = (result.Contents || [])
      .filter((item) => item.Key && !item.Key.endsWith('/'))
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))

    const files = await Promise.all(
      objects.map(async (item) => {
        const key = item.Key
        const fileName = getFileNameFromKey(key)

        return {
          key,
          fileName,
          size: item.Size,
          lastModified: item.LastModified,
          viewUrl: await getPresignedViewUrl(key),
          isImage: isImageFile(fileName),
          isPdf: isPdfFile(fileName),
        }
      }),
    )

    res.json({ files })
  } catch (error) {
    console.error('S3 list error:', error)
    res.status(500).json({
      error: error.message || 'Failed to load files',
    })
  }
})

export default router
