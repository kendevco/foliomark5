import type { Payload } from 'payload';
import type { Media } from '@/payload-types';
import type { CollectionSlug } from 'payload';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const MEDIA_COLLECTION = 'media' as CollectionSlug;
const SPACES_MEDIA_COLLECTION = 'spaces-media' as CollectionSlug;

export const exportMedia = async ({
  payload,
  outputDir
}: {
  payload: Payload
  outputDir: string
}) => {
  payload.logger.info('Exporting media files...');

  const mediaDir = path.join(outputDir, 'media');
  fs.mkdirSync(mediaDir, { recursive: true });

  // Get media from both collections
  const mediaResults = await payload.find({
    collection: MEDIA_COLLECTION,
    limit: 1000,
    depth: 0,
  });

  const spacesMediaResults = await payload.find({
    collection: SPACES_MEDIA_COLLECTION,
    limit: 1000,
    depth: 0,
  });

  // Export regular media
  for (const media of mediaResults.docs as Media[]) {
    await exportSingleMedia(media, mediaDir, MEDIA_COLLECTION);
  }

  // Export spaces media
  for (const media of spacesMediaResults.docs as Media[]) {
    await exportSingleMedia(media, mediaDir, SPACES_MEDIA_COLLECTION);
  }

  payload.logger.info('Media export completed');
};

async function exportSingleMedia(media: Media, mediaDir: string, collection: CollectionSlug) {
  try {
    // Create directory for this media item
    const mediaItemDir = path.join(mediaDir, collection, media.id);
    fs.mkdirSync(mediaItemDir, { recursive: true });

    // Save media metadata
    fs.writeFileSync(
      path.join(mediaItemDir, 'metadata.json'),
      JSON.stringify(media, null, 2)
    );

    // Download original file
    if (media.url) {
      const originalFilePath = path.join(mediaItemDir, 'original' + path.extname(media.url));
      await downloadFile(media.url, originalFilePath);
    }

    // Download size variants if they exist
    if ('sizes' in media) {
      for (const [sizeName, sizeData] of Object.entries(media.sizes || {})) {
        if (sizeData.url) {
          const variantPath = path.join(mediaItemDir, `${sizeName}${path.extname(sizeData.url)}`);
          await downloadFile(sizeData.url, variantPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error exporting media ${media.id}:`, error);
  }
}

async function downloadFile(url: string, outputPath: string) {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error);
    throw error;
  }
}
