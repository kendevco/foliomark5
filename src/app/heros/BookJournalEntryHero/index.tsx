// src\app\heros\BookJournalEntryHero\index.tsx
import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { BookJournalEntry, BookComment } from '../../../payload-types'

import { Media } from '../../components/Media'

export const BookJournalEntryHero: React.FC<{
  bookJournalEntry: BookJournalEntry
}> = ({ bookJournalEntry }) => {
  comments: BookComment[]
  const { book, user, lastReadDate, startDate, endDate, rating, review } = bookJournalEntry
  const { title, authors, coverImage } = book

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {genres?.map((genre, index) => {
              if (typeof book.genres === 'object' && book.genres !== null) {
                const { title: genreTitle } = book.genres

                const titleToUse = genreTitle || 'Untitled genre'

                const isLast = index === genres.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>,  </React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            <div className="flex flex-col gap-4">
              {authors && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>
                  {authors.map((author, index) => {
                    const { name } = author

                    const isLast = index === populatedAuthors.length - 1
                    const secondToLast = index === populatedAuthors.length - 2

                    return (
                      <React.Fragment key={index}>
                        {name}
                        {secondToLast && populatedAuthors.length > 2 && (
                          <React.Fragment>, </React.Fragment>
                        )}
                        {secondToLast && populatedAuthors.length === 2 && (
                          <React.Fragment> </React.Fragment>
                        )}
                        {!isLast && populatedAuthors.length > 1 && (
                          <React.Fragment>and </React.Fragment>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              )}
            </div>
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill imgClassName="-z-10 object-cover" resource={metaImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
*w
