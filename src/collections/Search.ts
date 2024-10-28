import type { CollectionConfig } from 'payload'
import { searchFields } from '../search/fieldOverrides'

export const Search: CollectionConfig = {
  slug: 'search',
  admin: {
    useAsTitle: 'title',
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
    ...searchFields,
  ],
}
