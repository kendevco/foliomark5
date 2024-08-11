// src/app/2sxc-Apps/2sxc-Book-Log/page.tsx

import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { CollectionArchive } from '@/components/BookJournalEntries/CollectionArchive'

export default async function BookLogPage() {
  const payload = await getPayloadHMR({ config: configPromise })

  const entries = await payload.find({
    collection: 'book-journal-entries',
    limit: 12,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <h1>Book Journal Entries</h1>
      </div>
      <CollectionArchive bookJournalEntries={entries.docs} />

    </div>
  )
}
