import { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '../../blocks/MediaBlock'
import { populateAuthors } from './hooks/populateAuthors'

const Books: CollectionConfig = {
  slug: 'books',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'isbn',
      type: 'text',
    },
    {
      name: 'genres',
      type: 'relationship',
      hasMany: true,
      relationTo: 'genres',
    },
    {
      name: 'pageCount',
      type: 'number',
    },
    {
      name: 'language',
      type: 'select',
      options: ['English', 'Spanish', 'French', 'German', 'Other'],
    },
    {
      name: 'averageRating',
      type: 'number',
      min: 0,
      max: 5,
    },
    {
      name: 'ratingsCount',
      type: 'number',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [MediaBlock],
    },
    {
      name: 'journalEntries',
      type: 'relationship',
      relationTo: 'book-journal-entries',
      hasMany: true,
    },
  ],
  hooks: {
    afterRead: [
      populateAuthors,
      async ({ doc, req }) => {
        const journalEntries = await req.payload.find({
          collection: 'book-journal-entries',
          where: {
            book: {
              equals: doc.id,
            },
          },
        })

        const comments = await req.payload.find({
          collection: 'book-comments',
          where: {
            book: {
              equals: doc.id,
            },
          },
        })

        return {
          ...doc,
          journalEntries: journalEntries.docs,
          comments: comments.docs,
        }
      },
    ],
  },
}

export default Books
