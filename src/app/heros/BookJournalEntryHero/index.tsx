// src\app\heros\BookJournalEntryHero\index.tsx
import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { BookJournalEntry } from '../../../payload-types' // Assuming updated type definition

import { Media } from '../../components/Media'

export const BookJournalEntryHero: React.FC<{
  bookJournalEntry: BookJournalEntry
}> = ({ bookJournalEntry }) => {
  const {
    book,
    user,
    lastReadDate,
    meta, // Access meta directly
  } = bookJournalEntry

  const bookTitle = typeof book === 'object' ? book.title : book;
  const authorName = typeof user === 'object' ? user.name : user;

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{bookTitle}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            <div className="flex flex-col gap-4">
              {authorName && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>
                  <span>{authorName}</span>
                </div>
              )}
            </div>
            {lastReadDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Last Read Date</p>

                <time dateTime={lastReadDate}>{formatDateTime(lastReadDate)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {meta?.image && typeof meta?.image !== 'string' && ( // Optional chaining
          <Media fill imgClassName="-z-10 object-cover" resource={meta.image} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
