// src/payload/collections/Authors/index.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'

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
    slugField('name'),
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'books',
      type: 'relationship',
      relationTo: 'books',
      hasMany: true,
    },
  ],
}

export default Authors
