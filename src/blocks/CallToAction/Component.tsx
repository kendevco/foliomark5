import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

// Define the link type structure with strict types (no nulls)
type LinkType = {
  type?: 'reference' | 'custom' | undefined
  newTab?: boolean | undefined
  reference?: { relationTo: 'pages'; value: string | Page } | undefined
  url?: string | undefined
  label: string
  appearance?: 'default' | 'outline' | 'secondary' | 'primary' | undefined
}

// Define the link item structure from Payload
type LinkItem = {
  link: LinkType
  id?: string
}

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" content={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map((linkItem) => {
            // Transform and sanitize the link data
            const transformedLink = {
              ...linkItem.link,
              appearance: linkItem.link.appearance === 'outline' ? 'outline' : 'default',
              url: linkItem.link.url || '',  // Ensure url is never null
              type: linkItem.link.type || 'custom', // Provide default type
              newTab: linkItem.link.newTab || false, // Provide default newTab value
            } as const

            return <CMSLink key={linkItem.id} size="lg" {...transformedLink} />
          })}
        </div>
      </div>
    </div>
  )
}
