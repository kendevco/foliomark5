// src/payload/collections/Books/hooks/revalidateBook.ts

import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateBook: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  if (doc._status === 'published') {
    const path = `/books/${doc.slug}`

    try {
      payload.logger.info(`Revalidating book at path: ${path}`)

      await revalidatePath(path)
      await revalidatePath('/books')

      payload.logger.info(`Successfully revalidated paths: ${path} and /books`)
    } catch (error) {
      payload.logger.error(`Failed to revalidate path: ${path}`, error)
    }
  }

  return doc
}
