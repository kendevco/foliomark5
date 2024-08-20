import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import React from 'react'
import RichText from 'src/app/components/RichText'

import type { Page } from '../../../payload-types'

import { Media } from '../../components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    position = 'default',
    staticImage,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
<<<<<<< HEAD
          container: position === 'default' && enableGutter,
=======
          'container mx-auto': position === 'default' && enableGutter,
>>>>>>> origin/main
        },
        className,
      )}
    >
      {position === 'fullscreen' && (
        <div className="relative">
          <Media resource={media} src={staticImage} />
        </div>
      )}
      {position === 'default' && (
<<<<<<< HEAD
        <Media imgClassName={cn('rounded', imgClassName)} resource={media} src={staticImage} />
=======
        <div className="flex justify-center"> {/* Add this wrapper div */}
          <Media
            imgClassName={cn('rounded', imgClassName)}
            resource={media}
            src={staticImage}
          />
        </div>
>>>>>>> origin/main
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
<<<<<<< HEAD
              container: position === 'fullscreen',
=======
              'container mx-auto': position === 'fullscreen',
>>>>>>> origin/main
            },
            captionClassName,
          )}
        >
          <RichText content={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
