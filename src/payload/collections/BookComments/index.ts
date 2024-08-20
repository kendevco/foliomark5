// src\payload\collections\BookComments\index.ts

import { CollectionConfig } from 'payload'

const BookComments: CollectionConfig = {
  slug: 'book-comments',
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books', // Change this line
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
  ],
} as const
export default BookComments
