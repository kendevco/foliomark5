import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

type ContentLinkType = {
  type?: 'reference' | 'custom' | undefined
  newTab?: boolean | undefined
  reference?: { relationTo: 'pages'; value: string | Page } | undefined
  url?: string | undefined
  label?: string
  appearance?: 'default' | 'outline' | 'secondary' | undefined
}

export const ContentBlock: React.FC<Props> = ({ columns }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
        {columns?.map((col, index) => {
          const { enableLink, link, richText } = col

          // Transform and sanitize the link data
          const transformedLink = link
            ? {
                ...link,
                url: link.url || '',
                type: link.type || 'custom',
                newTab: link.newTab || false,
                appearance: link.appearance || 'default',
              }
            : undefined

          return (
            <div key={index}>
              {richText && <RichText content={richText} enableGutter={false} />}
              {enableLink && transformedLink && <CMSLink {...transformedLink} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
