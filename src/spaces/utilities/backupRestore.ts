import { Payload } from 'payload';
import { Collection, CollectionConfig } from 'payload';
import fs from 'fs';
import path from 'path';

interface BackupOptions {
  collections?: string[];
  excludeCollections?: string[];
  backupDir?: string;
}

export async function backupCollections(payload: Payload, options: BackupOptions = {}) {
  const {
    collections = payload.config.collections.map((collection: CollectionConfig) => collection.slug),
    excludeCollections = [],
    backupDir = './backups',
  } = options;

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  fs.mkdirSync(backupPath);

  for (const collection of payload.config.collections) {
    const collectionConfig = collection as CollectionConfig;
    if (!collectionConfig.slug || excludeCollections.includes(collectionConfig.slug)) continue;
    if (collections.length && !collections.includes(collectionConfig.slug)) continue;

    try {
      const docs = await payload.find({
        collection: collectionConfig.slug,
        limit: 1000, // Adjust based on your needs
      });

      fs.writeFileSync(
        path.join(backupPath, `${collectionConfig.slug}.json`),
        JSON.stringify(docs, null, 2)
      );

      console.log(`Backed up collection: ${collectionConfig.slug}`);
    } catch (error) {
      console.error(`Failed to backup collection ${collectionConfig.slug}:`, error);
    }
  }

  return backupPath;
}

export async function restoreCollections(payload: Payload, backupPath: string, options: BackupOptions = {}) {
  const {
    collections = payload.config.collections.map((collection: CollectionConfig) => collection.slug),
    excludeCollections = [],
  } = options;

  for (const collection of payload.config.collections) {
    const collectionConfig = collection as CollectionConfig;
    if (!collectionConfig.slug || excludeCollections.includes(collectionConfig.slug)) continue;
    if (collections.length && !collections.includes(collectionConfig.slug)) continue;

    const backupFile = path.join(backupPath, `${collectionConfig.slug}.json`);
    if (!fs.existsSync(backupFile)) {
      console.log(`No backup found for collection: ${collectionConfig.slug}`);
      continue;
    }

    try {
      const backup = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

      // Clear existing documents
      await payload.delete({
        collection: collectionConfig.slug,
        where: {},
      });

      // Restore documents
      for (const doc of backup.docs) {
        await payload.create({
          collection: collectionConfig.slug,
          data: doc,
        });
      }

      console.log(`Restored collection: ${collectionConfig.slug}`);
    } catch (error) {
      console.error(`Failed to restore collection ${collectionConfig.slug}:`, error);
    }
  }
}
