// src\payload\collections\Authors\index.ts
import { CollectionConfig } from 'payload'
import slugGenerator from '../../../app/utilities/slugGenerator'

const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [slugGenerator],
      },
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'books',
      type: 'relationship',
      relationTo: 'books', // Ensure 'books' is the correct slug for the Books collection
      hasMany: true,
    },
  ],
}

export default Authors
