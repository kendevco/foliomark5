// src/payload/collections/BookJournalEntries/index.ts

import { CollectionConfig } from 'payload'
<<<<<<< HEAD
import { populateUsers } from './hooks/populateUsers'
import { revalidateBookJournalEntry } from './hooks/revalidate'
import { slugField } from '../../fields/slug'

=======
import slugify from 'slugify'
import { populateUsers } from './hooks/populateUsers'
>>>>>>> origin/main
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner'
import { Code } from '../../blocks/Code'
import { MediaBlock } from '../../blocks/MediaBlock'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const BookJournalEntries: CollectionConfig = {
  slug: 'book-journal-entries',
  admin: {
<<<<<<< HEAD
    useAsTitle: 'customTitle',
    defaultColumns: ['customTitle', 'book', 'user', 'lastReadDate'],
  },
  fields: [
    {
      name: 'customTitle',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
=======
    useAsTitle: 'book',
  },
  fields: [
    {
>>>>>>> origin/main
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'book',
              type: 'relationship',
              relationTo: 'books',
              required: true,
<<<<<<< HEAD
              hasMany: false,
=======
>>>>>>> origin/main
            },
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'review',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'lastReadDate',
              type: 'date',
              required: true,
            },
            {
              name: 'startDate',
              type: 'date',
            },
            {
              name: 'endDate',
              type: 'date',
            },
            {
              name: 'rating',
              type: 'number',
              min: 0,
              max: 5,
            },
            {
              name: 'pagesRead',
              type: 'number',
            },
            {
              name: 'readingStatus',
              type: 'select',
              options: [
                { label: 'To Read', value: 'to-read' },
                { label: 'Currently Reading', value: 'reading' },
                { label: 'Read', value: 'read' },
                { label: 'Abandoned', value: 'abandoned' },
              ],
            },
            {
              name: 'usersWithEntries',
              type: 'array',
              fields: [
                {
                  name: 'user',
                  type: 'relationship',
                  relationTo: 'users',
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
<<<<<<< HEAD
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
=======

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
>>>>>>> origin/main
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
<<<<<<< HEAD
    slugField('customTitle', {
=======
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
>>>>>>> origin/main
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
<<<<<<< HEAD
    }),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const { payload } = req
        const book = await payload.findByID({
          collection: 'books',
          id: data.book,
        })
        const user = await payload.findByID({
          collection: 'users',
          id: data.user,
        })
        const lastReadDate = new Date(data.lastReadDate).toLocaleDateString()

        data.customTitle = `${book.title} - ${user.name} - ${lastReadDate}`
        return data
      },
    ],
    afterChange: [
      revalidateBookJournalEntry,
      async ({ doc, req }) => {
        const { payload } = req
        const book = await payload.findByID({
          collection: 'books',
          id: doc.book,
        })
        const user = await payload.findByID({
          collection: 'users',
          id: doc.user,
        })
        const lastReadDate = new Date(doc.lastReadDate).toLocaleDateString()

        const updatedTitle = `${book.title} - ${user.name} - ${lastReadDate}`

        if (updatedTitle !== doc.customTitle) {
          await payload.update({
            collection: 'book-journal-entries',
            id: doc.id,
            data: {
              customTitle: updatedTitle,
            },
          })
        }

        return doc
=======
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        const { payload } = req

        // Set user to logged in user
        if (req.user) {
          data.user = req.user.id
        }

        // Find the most recently added entry
        const latestEntry = await payload.find({
          collection: 'book-journal-entries',
          sort: '-createdAt',
          limit: 1,
        })

        const today = new Date()
        let lastReadDate = today

        if (latestEntry.docs.length > 0) {
          const latestEntryDate = new Date(latestEntry.docs[0].lastReadDate)
          const sevenDaysLater = new Date(latestEntryDate)
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

          if (sevenDaysLater > today) {
            lastReadDate = sevenDaysLater
          }
        }

        // Set lastReadDate
        data.lastReadDate = lastReadDate.toISOString()

        // Set startDate to 7 days before lastReadDate
        const startDate = new Date(lastReadDate)
        startDate.setDate(startDate.getDate() - 7)
        data.startDate = startDate.toISOString()

        // Set endDate to lastReadDate
        data.endDate = lastReadDate.toISOString()

        // Generate slug
        if (data.book) {
          let bookTitle = 'untitled'
          if (
            typeof data.book === 'string' ||
            (typeof data.book === 'object' && data.book.toString)
          ) {
            const bookId = typeof data.book === 'string' ? data.book : data.book.toString()
            const bookDoc = await payload.findByID({
              collection: 'books',
              id: bookId,
              depth: 1,
            })
            bookTitle = bookDoc?.title || 'untitled'
          } else if (typeof data.book === 'object' && data.book.title) {
            bookTitle = data.book.title
          }

          const userName = req.user ? req.user.name : 'unknown'
          const slugBase = `${bookTitle}-${userName}`
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
          data.slug = `${slugBase}-${new Date(data.lastReadDate).toISOString().split('T')[0]}`
        }

        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data.readingStatus === 'read' && !data.endDate) {
          data.endDate = new Date().toISOString()
        }
        return data
>>>>>>> origin/main
      },
    ],
    afterRead: [populateUsers],
  },
}

export default BookJournalEntries
