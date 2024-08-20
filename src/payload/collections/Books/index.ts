<<<<<<< HEAD
// src/payload/collections/Books/index.ts
=======
>>>>>>> origin/main
import { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '../../blocks/MediaBlock'
<<<<<<< HEAD
import { slugField } from '../../fields/slug'
=======
import slugify from 'slugify'
>>>>>>> origin/main

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
<<<<<<< HEAD
    slugField('title'),
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.title) {
          const authorNames = await getAuthorNames(data.authors, req.payload)
          const slugBase = `${data.title} - ${authorNames.join(' ')}`
          data.slug = slugify(slugBase, { lower: true, strict: true })
        }
        return data
      },
    ],
  },
}

async function getAuthorNames(authorIds, payload) {
  const authorNames = []
  for (const authorId of authorIds) {
    const author = await payload.findByID({
      collection: 'authors',
      id: authorId,
    })
    if (author && author.name) {
      authorNames.push(author.name)
    }
  }
  return authorNames
>>>>>>> origin/main
}

export default Books
