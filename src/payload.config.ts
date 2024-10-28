// This is a modification of the file so I can check it back in to make a new push.
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { payloadCloudPlugin } from '@payloadcms/plugin-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'
import { fileURLToPath } from 'url'

import Categories from '@/collections/Categories'
import { Media as BaseMedia } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import Users from '@/collections/Users'
import { Profiles, Spaces, Members, Channels, Messages, Conversations, DirectMessages, SpacesMedia } from '@/spaces/collections'

import { Page, Post } from '@/payload-types'

import { seedHandler } from '@/endpoints/seedHandler'
import { Footer } from '@/globals/Footer/config'
import { Header } from '@/globals/Header/config'
import { Settings } from '@/spaces/globals/Settings/config'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

// Uncomment to use the AI Stack Lexical Editor
// import { payloadAiPlugin } from '@ai-stack/payloadcms'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const baseUrl =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : 'http://localhost:3000'

const plugins = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      fields: ({ defaultFields }: { defaultFields: any[] }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                components: {
                  Field: () => null, // Add required component
                },
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  seoPlugin({
    collections: ['pages', 'posts'],
    uploadsCollection: 'media',
    generateTitle: ({ doc }: { doc: Page | Post }) => {
      return doc?.title ? `${doc.title} | KenDev.Co` : 'KenDev.Co'
    },
    generateURL: ({ doc }: { doc: Page | Post }): string => {
      return doc?.slug
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${doc.slug}`
        : process.env.NEXT_PUBLIC_SERVER_URL || '/' // Provide default value
    },
  }),
  // Uncomment to use the AI Stack Lexical Editor
  // payloadAiPlugin({
  //   collections: {
  //     [Posts.slug]: true,
  //     [Pages.slug]: true,
  //   },
  //   debugging: false,
  // }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),

  //payloadCloudPlugin(), // storage-adapter-placeholder
]

// Only add Vercel Blob storage if token exists
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: {
        [SpacesMedia.slug]: true,
        [BaseMedia.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'YOUR-SECRET-KEY', // Required
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  collections: [
    Categories,
    Pages,
    Posts,
    BaseMedia,
    SpacesMedia,
    Users,
    Profiles,
    Spaces,
    Members,
    Channels,
    Messages,
    Conversations,
    DirectMessages,
  ],
  globals: [Header, Footer, Settings],
  plugins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  cors: [baseUrl].filter(Boolean),
  csrf: [baseUrl].filter(Boolean),
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      handler: seedHandler,
      method: 'get',
      path: '/seed',
    },
  ],
})
