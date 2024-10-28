import { Payload } from 'payload'
import { SpaceCollectionSlug, CollectionSlugs } from '@/spaces/collections/types'
import { Media } from '@/payload-types'
import path from 'path'
import fs from 'fs'

interface ImportMediaOptions {
  payload: Payload
  mediaDir: string
  collection?: SpaceCollectionSlug
}

export const importMedia = async ({
  payload,
  mediaDir,
  collection = CollectionSlugs.MEDIA
}: ImportMediaOptions): Promise<void> => {
  try {
    // Ensure media directory exists
    if (!fs.existsSync(mediaDir)) {
      console.log(`Media directory ${mediaDir} does not exist`)
      return
    }

    const files = fs.readdirSync(mediaDir)

    for (const file of files) {
      const filePath = path.join(mediaDir, file)
      const stats = fs.statSync(filePath)

      if (stats.isFile()) {
        const fileStream = fs.createReadStream(filePath)
        const fileBuffer = await streamToBuffer(fileStream)

        try {
          await payload.create({
            collection: collection,
            data: {
              filename: file,
            } as any, // Type assertion needed due to dynamic collection
            file: {
              data: fileBuffer,
              size: fileBuffer.length,
              mimetype: getMimeType(file),
              name: file,
            },
          })
          console.log(`Imported ${file}`)
        } catch (error) {
          console.error(`Failed to import ${file}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error importing media:', error)
    throw error
  }
}

const streamToBuffer = (stream: fs.ReadStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}
