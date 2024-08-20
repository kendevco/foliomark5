// src/payload/collections/Genres/index.ts
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '../fields/slug'

const Genres: CollectionConfig = {
  slug: 'genres',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    slugField('title', {
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    }),
  ],
}

export default Genres
