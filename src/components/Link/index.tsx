import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

type Props = {
  appearance?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null
  label?: string
  href?: string
  url?: string
  className?: string
  newTab?: boolean
  children?: React.ReactNode
  size?: 'default' | 'icon' | 'sm' | 'lg' | null
}

export const CMSLink: React.FC<Props> = ({
  appearance = 'default',
  label,
  href,
  url,
  className,
  newTab,
  children,
  size = 'default',
}) => {
  const newTabProps = newTab
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  return (
    <Button
      asChild
      className={className}
      size={size}
      variant={appearance}
    >
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
