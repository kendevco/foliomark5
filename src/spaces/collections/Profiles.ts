import { CollectionConfig, CollectionSlug } from 'payload'
import { CollectionSlugs } from './types'

const spacesSlug: CollectionSlug = CollectionSlugs.SPACES as CollectionSlug
const membersSlug: CollectionSlug = CollectionSlugs.MEMBERS as CollectionSlug
const channelsSlug: CollectionSlug = CollectionSlugs.CHANNELS as CollectionSlug

const Profiles: CollectionConfig = {
  slug: 'profiles',
  admin: {
    useAsTitle: 'name',
    group: 'Spaces',
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'URL to the profile image',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'spaces',
      type: 'relationship',
      relationTo: spacesSlug,
      hasMany: true,
    },
    {
      name: 'memberOf',
      type: 'relationship',
      relationTo: membersSlug,
      hasMany: true,
    },
    {
      name: 'accessibleChannels',
      type: 'relationship',
      relationTo: channelsSlug,
      hasMany: true,
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

export default Profiles
