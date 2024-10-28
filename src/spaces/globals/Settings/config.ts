// I need a Settings Globals Collection which are site wide settings that can be changed by the admin.
// These settings will be used in the app at various places like the header, footer, and other components.
// The Header and Footer have their own Globals ...

import { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import isAdminOrCreator from '@/spaces/access/isAdminorCreator' // Note the lowercase 'or'

export const Settings: GlobalConfig = {
  slug: 'settings' as const, // Add as const to make it a literal type
  access: {
    read: () => true,
    update: isAdminOrCreator, // Use the shared admin check
  },
  admin: {
    group: 'Global Settings',
    description: 'Global site settings and configuration',
  },
  fields: [
    {
      name: 'site',
      type: 'group',
      admin: {
        description: 'Basic site configuration',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'maintenance',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'message',
              type: 'richText',
              editor: lexicalEditor({}),
              admin: {
                condition: (_, siblingData) => siblingData?.enabled,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'apiKeys',
      type: 'group',
      admin: {
        description: 'API keys for various services',
        condition: ({ user }) => user?.roles?.includes('admin'),
      },
      fields: [
        {
          name: 'liveKit',
          type: 'group',
          fields: [
            {
              name: 'apiKey',
              type: 'text',
              admin: {
                description: 'LiveKit API Key',
              },
            },
            {
              name: 'apiSecret',
              type: 'text',
              admin: {
                description: 'LiveKit API Secret',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'LiveKit URL',
              },
            },
          ],
        },
        {
          name: 'aiServices',
          type: 'group',
          fields: [
            {
              name: 'deepgramApiKey',
              type: 'text',
            },
            {
              name: 'neetsApiKey',
              type: 'text',
            },
            {
              name: 'groqApiKey',
              type: 'text',
            },
            {
              name: 'openAiApiKey',
              type: 'text',
            },
            {
              name: 'anthropicApiKey',
              type: 'text',
            },
            {
              name: 'elevenLabsApiKey',
              type: 'text',
            },
          ],
        },
        {
          name: 'security',
          type: 'group',
          fields: [
            {
              name: 'googleRecaptchaSecret',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'aiSettings',
      type: 'group',
      fields: [
        {
          name: 'customEndpoints',
          type: 'array',
          admin: {
            description: 'Custom LLM API endpoints',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'endpoint',
              type: 'text',
              required: true,
            },
            {
              name: 'apiKeyField',
              type: 'text',
              admin: {
                description: 'Header field name for API key',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'workspaceSettings',
      type: 'group',
      fields: [
        {
          name: 'homeWorkspace',
          type: 'relationship',
          relationTo: 'spaces',
          hasMany: false,
          admin: {
            description: 'Select the default workspace for new users',
          },
        },
        {
          name: 'allowMultipleWorkspaces',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to create multiple workspaces',
          },
        },
        {
          name: 'maxWorkspacesPerUser',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.allowMultipleWorkspaces,
            description: 'Maximum number of workspaces a user can create (0 for unlimited)',
          },
        },
      ],
    },
  ],
}
