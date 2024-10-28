import { CollectionConfig } from 'payload'
import type { CollectionSlug } from 'payload'
import { ChannelType, CollectionSlugs } from './types'

const Channels: CollectionConfig = {
  slug: CollectionSlugs.CHANNELS,
  admin: {
    useAsTitle: 'name',
    group: 'Spaces',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: CollectionSlugs.SPACES as CollectionSlug,
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: Object.values(ChannelType),
      defaultValue: ChannelType.TEXT,
    },
  ],
}

export default Channels
