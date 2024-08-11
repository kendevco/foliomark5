import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data.title && (!originalDoc || data.title !== originalDoc.title)) {
          data.slug = slugify(data.title, { lower: true, strict: true })
        }
      },
    ],
  },
}

export default Genres
