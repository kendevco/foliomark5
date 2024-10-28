import type { Payload, PayloadRequest } from 'payload'
import path from 'path'
import fs from 'fs'
import { CollectionSlugs } from '@/spaces/collections/types'

export const importMedia = async ({
  payload,
  req,
  importDir,
}: {
  payload: Payload
  req: PayloadRequest
  importDir: string
}) => {
  payload.logger.info('Importing media files...')

  const mediaDir = path.join(importDir, 'media')
  if (!fs.existsSync(mediaDir)) {
    payload.logger.warn('No media directory found in import')
    return
  }

  // Import regular media
  await importCollectionMedia(payload, req, mediaDir, CollectionSlugs.MEDIA)

  // Import spaces media
  await importCollectionMedia(payload, req, mediaDir, 'spaces-media')
}

async function importCollectionMedia(
  payload: Payload,
  req: PayloadRequest,
  mediaDir: string,
  collectionSlug: string,
) {
  const collectionDir = path.join(mediaDir, collectionSlug)
  if (!fs.existsSync(collectionDir)) return

  // Read all media item directories
  const mediaItems = fs.readdirSync(collectionDir)

  for (const mediaId of mediaItems) {
    const mediaItemDir = path.join(collectionDir, mediaId)
    const metadataPath = path.join(mediaItemDir, 'metadata.json')

    try {
      // Read metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

      // Find original file
      const files = fs.readdirSync(mediaItemDir)
      const originalFile = files.find((f) => f.startsWith('original'))

      if (!originalFile) {
        payload.logger.warn(`No original file found for media ${mediaId}`)
        continue
      }

      // Create file stream for upload
      const fileStream = fs.createReadStream(path.join(mediaItemDir, originalFile))

      // Create new media document
      await payload.create({
        collection: collectionSlug,
        data: {
          ...metadata,
          file: fileStream, // Payload handles the file upload
        },
        req,
      })

      payload.logger.info(`Imported media ${mediaId}`)
    } catch (error) {
      payload.logger.error(`Error importing media ${mediaId}:`, error)
    }
  }
}
