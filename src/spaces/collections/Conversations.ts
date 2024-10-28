import { CollectionConfig } from 'payload'
import type { CollectionSlug } from 'payload'
import { CollectionSlugs } from './types'

const Conversations: CollectionConfig = {
  slug: CollectionSlugs.CONVERSATIONS,
  admin: {
    useAsTitle: 'id',
    group: 'Spaces',
  },
  fields: [
    {
      name: 'participants',
      type: 'relationship',
      relationTo: CollectionSlugs.USERS,
      hasMany: true,
      required: true,
    },
    {
      name: 'lastMessage',
      type: 'relationship',
      relationTo: CollectionSlugs.DIRECT_MESSAGES as CollectionSlug,
      admin: {
        description: 'The most recent message in this conversation',
      },
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

export default Conversations
