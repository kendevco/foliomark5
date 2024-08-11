// src/payload/collections/BookJournalEntries/hooks/populateUsers.ts

import type { CollectionAfterReadHook } from 'payload'

export const populateUsers: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.user) {
    const userDoc = await payload.findByID({
      id: typeof doc.user === 'object' ? doc.user?.id : doc.user,
      collection: 'users',
      depth: 0,
      req,
    })

    doc.populatedUser = {
      id: userDoc.id,
      name: userDoc.name,
    }
  }

  if (doc?.usersWithEntries) {
    const populatedUsersWithEntries = []

    for (const entry of doc.usersWithEntries) {
      if (entry.user) {
        const userDoc = await payload.findByID({
          id: typeof entry.user === 'object' ? entry.user?.id : entry.user,
          collection: 'users',
          depth: 0,
          req,
        })

        populatedUsersWithEntries.push({
          ...entry,
          user: {
            id: userDoc.id,
            name: userDoc.name,
          },
        })
      }
    }

    doc.populatedUsersWithEntries = populatedUsersWithEntries
  }

  return doc
}
