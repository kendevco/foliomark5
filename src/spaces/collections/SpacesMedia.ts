import { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import isAdminOrCreator from '@/spaces/access/isAdminorCreator'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

// Export the enum
export const MediaCategories = {
  SPACE: 'space',
  PROFILE: 'profile',
  MESSAGE: 'message',
  CHANNEL: 'channel',
} as const

export type MediaCategory = (typeof MediaCategories)[keyof typeof MediaCategories]

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const SpacesMedia: CollectionConfig = {
  slug: 'spaces-media',
  upload: {
    staticDir: path.resolve(dirname, '../../../public/spaces-media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'profile',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'space',
        width: 600,
        height: 400,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: isAdminOrCreator,
    delete: isAdminOrCreator,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Space', value: MediaCategories.SPACE },
        { label: 'Profile', value: MediaCategories.PROFILE },
        { label: 'Message', value: MediaCategories.MESSAGE },
        { label: 'Channel', value: MediaCategories.CHANNEL },
      ],
    },
    {
      name: 'fileType',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'Audio', value: 'audio' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'fileSize',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        condition: (data) => ['video', 'audio'].includes(data.fileType),
      },
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.fileType === 'video',
        description: 'Optional thumbnail for video preview',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => ({
        ...data,
        createdBy: req.user?.id,
        fileSize: data.size, // File size is available in data for upload collections
        mimeType: data.mimeType, // Mime type is available in data
        fileType: data.mimeType ? data.mimeType.split('/')[0] : 'other',
      }),
    ],
  },
}
