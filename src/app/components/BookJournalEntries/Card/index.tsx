// src\app\components\BookJournalEntries\Card\index.tsx

'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { BookJournalEntry } from '../../../../payload-types'

import { Media } from '../../Media'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: BookJournalEntry | Record<string, unknown>
  relationTo?: 'book-journal-entries'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const {
    slug,
    meta,
    book,
    user
  } = (doc as BookJournalEntry) || {};

  const bookTitle = typeof book === 'object' ? book.title : book;
  const author = typeof user === 'object' ? user.name : user;

  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || bookTitle
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="360px" />}
      </div>
      <div className="p-4">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {author && <div className="mt-2">By {author}</div>}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
