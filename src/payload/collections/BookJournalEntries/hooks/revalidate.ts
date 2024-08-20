// src/payload/collections/BookJournalEntries/hooks/revalidate.ts

import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { BookJournalEntry } from '../../../../payload-types'

export const revalidateBookJournalEntry: CollectionAfterChangeHook<BookJournalEntry> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // Revalidate the path every time a save is made
  const path = `/book-journal-entries/${doc.slug}`

  payload.logger.info(`Revalidating book journal entry at path: ${path}`)

  revalidatePath(path)

  // If the slug has changed, we need to revalidate the old path as well
  if (previousDoc && previousDoc.slug !== doc.slug) {
    const oldPath = `/book-journal-entries/${previousDoc.slug}`

    payload.logger.info(`Revalidating old book journal entry at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
