import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { BookJournalEntry } from '../../../payload-types'

import { Media } from '../../components/Media'

export const BookJournalEntryHero: React.FC<{
  entry: BookJournalEntry
}> = ({ entry }) => {
  const { book, user, lastReadDate, startDate, endDate, rating, review } = entry

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {book && typeof book === 'object' && (
              <React.Fragment>
                {book.title}
              </React.Fragment>
            )}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{book.title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {user && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">User</p>
                <span>{user.name}</span>
              </div>
            )}
            {lastReadDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Last Read Date</p>
                <time dateTime={lastReadDate}>{formatDateTime(lastReadDate)}</time>
              </div>
            )}
            {startDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Start Date</p>
                <time dateTime={startDate}>{formatDateTime(startDate)}</time>
              </div>
            )}
            {endDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">End Date</p>
                <time dateTime={endDate}>{formatDateTime(endDate)}</time>
              </div>
            )}
            {rating !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Rating</p>
                <span>{rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {book.coverImage && typeof book.coverImage !== 'string' && (
          <Media fill imgClassName="-z-10 object-cover" resource={book.coverImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
import { formatDateTime } from '@/app/utilities/formatDateTime'
import React from 'react'

import type { BookJournalEntry } from '../../../payload-types'

import { Media } from '../../components/Media'

export const BookJournalEntryHero: React.FC<{
  entry: BookJournalEntry
}> = ({ entry }) => {
  const { book, user, lastReadDate, startDate, endDate, rating, review } = entry

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {book && typeof book === 'object' && (
              <React.Fragment>
                {book.title}
              </React.Fragment>
            )}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{book.title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {user && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">User</p>
                <span>{user.name}</span>
              </div>
            )}
            {lastReadDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Last Read Date</p>
                <time dateTime={lastReadDate}>{formatDateTime(lastReadDate)}</time>
              </div>
            )}
            {startDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Start Date</p>
                <time dateTime={startDate}>{formatDateTime(startDate)}</time>
              </div>
            )}
            {endDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">End Date</p>
                <time dateTime={endDate}>{formatDateTime(endDate)}</time>
              </div>
            )}
            {rating !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Rating</p>
                <span>{rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {book.coverImage && typeof book.coverImage !== 'string' && (
          <Media fill imgClassName="-z-10 object-cover" resource={book.coverImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
