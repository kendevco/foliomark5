import React from 'react'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-semibold">
          Your App
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/spaces" className="text-sm hover:text-foreground">
              Spaces
            </Link>
            <Link href="/about" className="text-sm hover:text-foreground">
              About
            </Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
