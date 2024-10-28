import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t">
      <div className="container flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
        <nav className="flex items-center space-x-4 text-sm">
          <a href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  )
}
