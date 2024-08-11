// src/payload/collections/BookJournalEntries/index.ts

import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { populateUsers } from './hooks/populateUsers'
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
    useAsTitle: 'book',
  },
  fields: [
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data.book && (!originalDoc || data.book !== originalDoc.book)) {
          data.slug = slugify(data.book.title, { lower: true, strict: true })
        }
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data.readingStatus === 'read' && !data.endDate) {
          data.endDate = new Date().toISOString()
        }
        return data
      },
    ],
    afterRead: [populateUsers],
  },
}

export default BookJournalEntries
