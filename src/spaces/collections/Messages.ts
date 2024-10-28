import { CollectionConfig } from 'payload'
import { CollectionSlug } from 'payload'

const usersSlug: CollectionSlug = 'users' as CollectionSlug
const channelsSlug: CollectionSlug = 'channels' as CollectionSlug

const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'content',
    group: 'Spaces',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: usersSlug,
      required: true,
    },
    {
      name: 'channel',
      type: 'relationship',
      relationTo: channelsSlug,
      required: true,
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

export default Messages
