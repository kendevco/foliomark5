import type { Payload, CollectionConfig } from 'payload';
import type { CollectionSlug, GlobalSlug } from 'payload';
import { collections } from '@/collections';
import fs from 'fs';
import path from 'path';

export const exportData = async ({
  payload,
  outputDir = 'cache/exports',
  timestamp = new Date().toISOString().split('T')[0]
}: {
  payload: Payload
  outputDir?: string
  timestamp?: string
}) => {
  payload.logger.info('Exporting database...');

  const exportDir = path.resolve(process.cwd(), outputDir, timestamp);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Export collections using proper typing
  for (const collection of collections) {
    payload.logger.info(`Exporting collection: ${collection.slug}`);
    try {
      const data = await payload.find({
        collection: collection.slug as CollectionSlug,
        limit: 1000,
        depth: 3,
      });

      fs.writeFileSync(
        path.join(exportDir, `${collection.slug}.json`),
        JSON.stringify(data.docs, null, 2)
      );
    } catch (error) {
      payload.logger.error(`Error exporting ${collection.slug}:`, error);
    }
  }

  // Export globals
  const globals = payload.config.globals?.map(g => g.slug) || [];
  const globalsData = await Promise.all(
    globals.map(async (slug) => {
      try {
        const data = await payload.findGlobal({
          slug: slug as GlobalSlug,
          depth: 3,
        });
        return { slug, data };
      } catch (error) {
        payload.logger.error(`Error exporting global ${slug}:`, error);
        return null;
      }
    })
  );

  fs.writeFileSync(
    path.join(exportDir, 'globals.json'),
    JSON.stringify(globalsData.filter(Boolean), null, 2)
  );

  // Create manifest
  const manifest = {
    timestamp,
    collections: collections.map(c => c.slug),
    globals,
    mediaExported: true,
  };

  fs.writeFileSync(
    path.join(exportDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  payload.logger.info(`Data exported to ${exportDir}`);
  return exportDir;
};
