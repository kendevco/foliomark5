// src/app/2sxc-Apps/2sxc-Book-Log/details/[slug]/page.tsx

import React from 'react'
import { BookJournalEntryHero } from '../../../../../heros/BookJournalEntryHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import RichText from 'src/app/components/RichText'

import { Metadata } from 'next'
import { generateMeta } from '../../../../../utilities/generateMeta'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const entries = await payload.find({
    collection: 'book-journal-entries',
    limit: 100,
  })

  return entries.docs?.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const entry = await queryEntryBySlug({ slug })
  return generateMeta({ doc: entry as any })
}

export default async function BookJournalEntry({ params: { slug = '' } }) {
  const entry = await queryEntryBySlug({ slug })

  if (!entry) return <PayloadRedirects url={`/2sxc-Apps/2sxc-Book-Log/details/${slug}`} />

  return (
    <article className="pt-16 pb-16">
      <BookJournalEntryHero bookJournalEntry={entry} />
      <div className="flex flex-col gap-4 pt-8">
        <div className="container">
          <RichText content={entry.review} />
        </div>
      </div>
    </article>
  )
}

const queryEntryBySlug = async ({ slug }) => {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'book-journal-entries',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
