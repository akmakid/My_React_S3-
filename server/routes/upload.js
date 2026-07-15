import { Router } from 'express'
import multer from 'multer'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { bucketName, getObjectUrl, s3Client } from '../config/s3.js'
import { getPresignedViewUrl } from '../utils/files.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    if (!bucketName) {
      return res.status(500).json({ error: 'AWS_S3_BUCKET is not configured in .env' })
    }

    const key = `uploads/${Date.now()}-${req.file.originalname}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }),
    )

    res.json({
      success: true,
      key,
      url: getObjectUrl(key),
      viewUrl: await getPresignedViewUrl(key),
      fileName: req.file.originalname,
      size: req.file.size,
    })
  } catch (error) {
    console.error('S3 upload error:', error)
    res.status(500).json({
      error: error.message || 'Upload failed',
    })
  }
})

export default router
