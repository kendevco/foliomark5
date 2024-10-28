import { CollectionConfig } from 'payload'
import { CollectionSlug } from 'payload'

enum CollectionSlugs {
  CONVERSATIONS = 'conversations',
  // ... other slugs ...
}

const usersSlug: CollectionSlug = 'users'

const DirectMessages: CollectionConfig = {
  slug: 'directMessages',
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
      name: 'sender',
      type: 'relationship',
      relationTo: usersSlug,
      required: true,
    },
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations' as CollectionSlug,
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
    {
      name: 'read',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: usersSlug,
        },
        {
          name: 'readAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [() => new Date()],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          updatedAt: new Date(),
        }
      },
    ],
  },
}

export default DirectMessages
