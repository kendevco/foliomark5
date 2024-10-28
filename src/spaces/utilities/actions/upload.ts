'use server'

import { getPayloadClient } from '../payload/getPayloadClient'
import { MediaCategory } from '@/spaces/collections/types'

interface UploadOptions {
  file: File
  category: MediaCategory
  userId: string
  alt?: string
  caption?: string
}

interface UploadResponse {
  url: string
  id: string
  filename: string
  mimeType: string
  fileSize: number
  alt: string
  category: MediaCategory
}

class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

export async function uploadFile({
  file,
  category,
  userId,
  alt,
  caption,
}: UploadOptions): Promise<UploadResponse> {
  if (!file) {
    throw new UploadError('No file provided', 'NO_FILE')
  }

  if (!userId) {
    throw new UploadError('User ID is required', 'NO_USER')
  }

  if (!category) {
    throw new UploadError('Category is required', 'NO_CATEGORY')
  }

  const payload = await getPayloadClient()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const media = await payload.create({
      collection: 'spaces-media',
      data: {
        alt: alt || file.name,
        caption: caption || `Uploaded ${file.name}`,
        category,
        uploadedBy: userId,
        createdBy: userId,
        fileType: file.type.split('/')[0],
        mimeType: file.type,
        fileSize: buffer.byteLength,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: buffer.byteLength,
      },
    })

    return {
      url: media.url,
      id: media.id,
      filename: media.filename,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      alt: media.alt,
      category: media.category,
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new UploadError(error instanceof Error ? error.message : 'Upload failed', 'UPLOAD_FAILED')
  }
}
