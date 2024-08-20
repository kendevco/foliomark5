// src/payload/collections/BookJournalEntries/index.ts

import { CollectionConfig } from 'payload'
import { populateUsers } from './hooks/populateUsers'
import { revalidateBookJournalEntry } from './hooks/revalidate'
import { slugField } from '../../fields/slug'

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
              hasMany: false,
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
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField('customTitle', {
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
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
      },
    ],
    afterRead: [populateUsers],
  },
}

export default BookJournalEntries
